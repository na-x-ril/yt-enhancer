// src/content-scripts/youtube/features/watch/index.ts
import type {
  YouTubePlayer,
  InitialData,
  InitialPlayerResponse,
  PlayerMicroformatRenderer,
} from "@/content-scripts/youtube/types";
import { storageBridge } from "../../bridge/bridge";
import type {
  InitialPlayerResponseVideoDetails,
  UpdateDateTextAction,
  UpdateViewershipAction,
  YouTubeUpdateResponse,
} from "../../types/videoData";
import {
  delay,
  fetchData,
  getVideoId,
  waitForElement,
  waitForPlayer,
} from "../../utils";
import { CountUp } from "countup.js";

export const watchFeature = (() => {
  let videoId: string | null = null;
  let videoState: number | null = null;
  let player: YouTubePlayer | null = null;
  let quality: string | null;
  let qualityReferenceKey = "quality_reference";
  let isLiveNow: boolean = false;

  // Config state
  let autoLoopEnabled = true;
  let autoCaptionEnabled = true;
  let qualityServiceEnabled = true;
  let qualityChangeListener: ((q: string) => void) | null = null;
  let isCaptionActive = false;

  // Animation state
  let currentViewCount = 0;
  let currentDateText = "";
  let animationFrameId: number | null = null;

  // time tracking
  let lastSavedTime = 0;
  let cleanupTimeTracking: (() => void) | null = null;

  const saveCurrentTime = async () => {
    if (!player || !videoId || isLiveNow) return;

    try {
      const currentTime = player.getCurrentTime();

      if (
        currentTime &&
        currentTime > 0 &&
        Math.abs(currentTime - lastSavedTime) >= 3
      ) {
        await storageBridge.set(`video_time_${videoId}`, currentTime);
        lastSavedTime = currentTime;
        console.log(`Saved time: ${currentTime}s for video ${videoId}`);
      }
    } catch (err) {
      console.warn("Failed to save current time:", err);
    }
  };

  const restoreLastTime = async () => {
    if (!player || !videoId || isLiveNow) return;

    try {
      const savedTime = await storageBridge.get(`video_time_${videoId}`);
      if (savedTime && savedTime > 0) {
        player.seekTo(savedTime, true);
        console.log(`Restored time: ${savedTime}s for video ${videoId}`);
      }
    } catch (err) {
      console.warn("Failed to restore time:", err);
    }
  };

  const setupTimeTracking = (player: YouTubePlayer) => {
    if (isLiveNow) return null;

    const onPause = () => {
      saveCurrentTime();
    };

    const onStateChange = (state: number) => {
      if (state === 2 || state === 0) {
        saveCurrentTime();
      }
    };

    player.addEventListener("onPause", onPause);
    player.addEventListener("onStateChange", onStateChange);

    // Cleanup function
    return () => {
      player.removeEventListener("onPause", onPause);
      player.removeEventListener("onStateChange", onStateChange);
    };
  };

  // ===== Network Intercept Functions =====
  const setupNetworkIntercept = () => {
    const originalFetch = window.fetch;

    const fetchProxy = new Proxy(originalFetch, {
      apply: async (
        target,
        thisArg,
        args: [RequestInfo | URL, RequestInit?],
      ) => {
        const [input] = args;
        const response = await Reflect.apply(target, thisArg, args);

        // Check if this is an updated metadata request
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.href
              : (input as Request).url;

        if (url?.includes("/youtubei/v1/updated_metadata")) {
          try {
            const clone = response.clone();
            const data: YouTubeUpdateResponse = await clone.json();

            if (data.actions) {
              handleYouTubeUpdate(data.actions);
            }
          } catch (err) {
            console.warn("Failed to parse update response:", err);
          }
        }

        return response;
      },
    });

    window.fetch = fetchProxy as typeof window.fetch;

    return () => {
      window.fetch = originalFetch;
    };
  };

  const handleYouTubeUpdate = (
    actions: Array<UpdateViewershipAction | UpdateDateTextAction>,
  ) => {
    let newViewCount: string | undefined;
    let newDateText: string | undefined;

    for (const action of actions) {
      // Extract view count
      if ("updateViewershipAction" in action) {
        const viewCountData =
          action.updateViewershipAction?.viewCount?.videoViewCountRenderer
            ?.viewCount;

        if (viewCountData) {
          if (viewCountData.simpleText) {
            newViewCount = viewCountData.simpleText;
          } else if (viewCountData.runs) {
            newViewCount = viewCountData.runs.map((r) => r.text).join("");
          }
        }
      }

      // Extract date text
      if ("updateDateTextAction" in action) {
        const dateTextData = action.updateDateTextAction?.dateText;

        if (dateTextData) {
          if (dateTextData.simpleText) {
            newDateText = dateTextData.simpleText;
          } else if (dateTextData.runs) {
            newDateText = dateTextData.runs.map((r) => r.text).join("");
          }
        }
      }
    }

    // Update display if we have new data
    if (newViewCount || newDateText) {
      const existingInfo = document.getElementById("yt-enhancer-video-info");
      if (existingInfo) {
        if (newViewCount) {
          // Parse view count baru untuk perbandingan
          const newViewCountData = parseViewCountData(newViewCount);
          const newCount = newViewCountData.count;

          // Skip jika tidak ada perubahan
          if (newCount !== currentViewCount && currentViewCount > 0) {
            const viewCountElement = document.getElementById(
              "yt-enhancer-view-count",
            );

            if (viewCountElement) {
              console.log("Auto-updating view count:", newViewCount);
              animateViewCountWithSuffix(
                viewCountElement,
                currentViewCount,
                newViewCount,
              );
            }
          } else {
            console.log("View count unchanged, skipping animation");
          }
        }

        if (newDateText && newDateText !== currentDateText) {
          const dateTextElement = document.getElementById(
            "yt-enhancer-date-text",
          );
          if (dateTextElement) {
            console.log("Auto-updating date text:", newDateText);
            dateTextElement.textContent = newDateText;
            currentDateText = newDateText;
          }
        }
      }
    }
  };

  const animateViewCountWithSuffix = (
    element: HTMLElement,
    fromValue: number,
    newViewCountString: string, // e.g., "4.5K views" atau "1,234 views"
  ) => {
    // Parse data dari string
    const viewCountData = parseViewCountData(newViewCountString);
    const toValue = viewCountData.count;

    // Skip jika tidak ada perubahan
    if (toValue === fromValue || fromValue === 0) {
      element.textContent = newViewCountString;
      currentViewCount = toValue;
      return;
    }

    // Cancel animasi sebelumnya jika ada
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    // Extract number dan suffix dari original string
    const { suffix, divisor, decimalPlaces } =
      extractNumberAndSuffix(newViewCountString);

    // Hitung durasi dinamis
    const diff = Math.abs(toValue - fromValue);
    const base =
      diff < 10 ? 1.2 : Math.min(3.5, 1.5 + Math.log10(diff + 1) * 0.8);
    const duration = base + 0.7 * Math.min(1, Math.log10(diff + 1));

    // Konfigurasi CountUp
    const options = {
      startVal: fromValue / divisor,
      decimalPlaces: decimalPlaces,
      duration: duration,
      useGrouping: true,
      useEasing: true,
      smartEasingThreshold: 999,
      smartEasingAmount: 333,
      separator: ",",
      decimal: ".",
      suffix: suffix,

      easingFn: (t: number, b: number, c: number, d: number): number => {
        const progress = t / d;
        const eased = easeInOutExpo(progress);
        return b + c * eased;
      },

      onCompleteCallback: () => {
        currentViewCount = toValue;
        animationFrameId = null;
      },
    };

    // Inisialisasi dan start CountUp
    const countUp = new CountUp(element, toValue / divisor, options);

    if (!countUp.error) {
      countUp.start();
      animationFrameId = 1;
    } else {
      console.error("CountUp error:", countUp.error);
      element.textContent = newViewCountString;
      currentViewCount = toValue;
    }
  };

  const extractNumberAndSuffix = (
    viewCountString: string,
  ): {
    number: number;
    suffix: string;
    divisor: number;
    decimalPlaces: number;
  } => {
    if (!viewCountString) {
      return { number: 0, suffix: "", divisor: 1, decimalPlaces: 0 };
    }

    const lowerStr = viewCountString.toLowerCase();
    let divisor = 1;
    let decimalPlaces = 0;

    // Deteksi multiplier
    if (lowerStr.includes("k")) {
      divisor = 1000;
      decimalPlaces = 1;
    } else if (lowerStr.includes("m")) {
      divisor = 1000000;
      decimalPlaces = 1;
    } else if (lowerStr.includes("jt")) {
      divisor = 1000000;
      decimalPlaces = 1;
    } else if (lowerStr.includes("b") || lowerStr.includes("miliar")) {
      divisor = 1000000000;
      decimalPlaces = 1;
    }

    const suffixMatch = viewCountString.match(/^[\d.,\s]+(.*)$/);
    const suffix = ` ${suffixMatch && suffixMatch[1] ? suffixMatch[1].trim() : ""}`;

    // Extract number untuk CountUp
    const useComma =
      viewCountString.includes(",") && !viewCountString.match(/\d+\.\d+[KMB]/i);
    const normalized = viewCountString.replace(/,/g, useComma ? "" : ".");
    const cleaned = normalized.replace(/[^\d.]/g, "");

    let multiplier = 1;
    if (lowerStr.includes("k")) multiplier = 1000;
    else if (lowerStr.includes("m") || lowerStr.includes("jt"))
      multiplier = 1000000;
    else if (lowerStr.includes("b") || lowerStr.includes("miliar"))
      multiplier = 1000000000;

    const num = parseFloat(cleaned);
    const number = isNaN(num) ? 0 : num * multiplier;

    return {
      number,
      suffix,
      divisor,
      decimalPlaces,
    };
  };

  const easeInOutExpo = (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) {
      return Math.pow(2, 20 * t - 10) / 2;
    }
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  };

  const parseViewCountData = (
    viewCountStr: string,
  ): { count: number; formatted: string; useComma: boolean } => {
    if (!viewCountStr) return { count: 0, formatted: "0", useComma: false };

    const formatted = viewCountStr;
    const lowerStr = viewCountStr.toLowerCase();

    const useComma =
      viewCountStr.includes(",") && !viewCountStr.match(/\d+\.\d+[KMB]/i);

    const normalized = viewCountStr.replace(/,/g, useComma ? "" : ".");
    const cleaned = normalized.replace(/[^\d.]/g, "");

    let multiplier = 1;
    if (lowerStr.includes("k")) multiplier = 1000;
    else if (lowerStr.includes("m") || lowerStr.includes("jt"))
      multiplier = 1000000;
    else if (lowerStr.includes("b") || lowerStr.includes("miliar"))
      multiplier = 1000000000;

    const num = parseFloat(cleaned);
    return {
      count: isNaN(num) ? 0 : Math.floor(num * multiplier),
      formatted: formatted,
      useComma: useComma,
    };
  };

  // ===== Display Functions =====
  const displayVideoInfo = async (
    viewCount: string,
    dateText: string,
    isUpdate: boolean = false,
  ) => {
    const viewCountData = parseViewCountData(viewCount);
    const newViewCount = viewCountData.count;

    const existingInfo = document.getElementById("yt-enhancer-video-info");
    const viewCountElement = document.getElementById("yt-enhancer-view-count");

    // Update existing element
    if (isUpdate && existingInfo && viewCountElement) {
      animateViewCountWithSuffix(viewCountElement, currentViewCount, viewCount);

      const dateTextElement = document.getElementById("yt-enhancer-date-text");
      if (dateTextElement) {
        dateTextElement.textContent = dateText;
        currentDateText = dateText;
      }
      return;
    }

    // Create new element
    if (existingInfo) existingInfo.remove();
    currentViewCount = newViewCount;
    currentDateText = dateText;

    const titleElement = await waitForElement("#above-the-fold > div#title");
    if (!titleElement) {
      console.warn("Title element not found");
      return;
    }

    const infoWrapper = document.createElement("div");
    infoWrapper.id = "yt-enhancer-video-info";

    const infoContainer = document.createElement("div");
    infoContainer.id = "info-container";

    const viewCountSpan = document.createElement("span");
    viewCountSpan.id = "yt-enhancer-view-count";
    viewCountSpan.textContent = viewCount; // Display original format dengan suffix
    viewCountSpan.style.fontVariantNumeric = "tabular-nums";

    const separator = document.createElement("span");
    separator.textContent = "•";

    const dateTextSpan = document.createElement("span");
    dateTextSpan.id = "yt-enhancer-date-text";
    dateTextSpan.textContent = dateText;

    infoContainer.append(viewCountSpan, separator, dateTextSpan);

    const refreshButton = document.createElement("button");
    refreshButton.id = "yt-enhancer-refresh-btn";
    refreshButton.innerHTML = `
      <svg height="24" viewBox="0 0 24 24" width="24" focusable="false">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"></path>
      </svg>
    `;

    refreshButton.onclick = async () => {
      refreshButton.style.pointerEvents = "none";
      refreshButton.style.opacity = "0.5";

      const svg = refreshButton.querySelector<SVGElement>("svg");
      if (svg) {
        svg.style.transition = "transform 0.5s ease";
        svg.style.transform = "rotate(360deg)";
      }

      await fetchAndLogVideoData(true);

      setTimeout(() => {
        refreshButton.style.pointerEvents = "auto";
        refreshButton.style.opacity = "1";
        if (svg) svg.style.transform = "rotate(0deg)";
      }, 500);
    };

    infoWrapper.append(infoContainer, refreshButton);
    titleElement.insertAdjacentElement("afterend", infoWrapper);
  };

  // ===== YouTube Data Functions =====
  const parseYTData = (html: string) => {
    const initialDataMatch = html.match(/var ytInitialData\s*=\s*(\{.*?\});/);
    const initialPlayerResponseMatch = html.match(
      /var ytInitialPlayerResponse\s*=\s*(\{.*?\});/,
    );

    const ytInitialData = initialDataMatch?.[1] ?? null;
    const ytInitialPlayerResponse = initialPlayerResponseMatch?.[1] ?? null;

    return { ytInitialData, ytInitialPlayerResponse };
  };

  const fetchVideoData = async (url: string) => {
    const html = await fetchData(url);
    return parseYTData(html);
  };

  const setVideoState = (
    microformat: PlayerMicroformatRenderer,
    videoDetails: InitialPlayerResponseVideoDetails,
  ) => {
    const liveDetails = microformat?.liveBroadcastDetails;

    if (liveDetails?.isLiveNow === true) {
      videoState = 3; // live now
      isLiveNow = true;
    } else if (liveDetails?.isLiveNow === false && !videoDetails.isUpcoming) {
      videoState = 2; // was live
    } else if (liveDetails?.isLiveNow === false && videoDetails.isUpcoming) {
      videoState = 4; // upcoming
    } else {
      videoState = 1; // not live
    }
  };

  const getViewCount = (data: InitialData) => {
    const content =
      data.contents.twoColumnWatchNextResults.results.results.contents[0]
        ?.videoPrimaryInfoRenderer?.viewCount.videoViewCountRenderer.viewCount;

    if (videoState === 4 || videoState === 3) {
      return content?.runs?.map((r) => r.text).join("");
    }
    return content?.simpleText;
  };

  const getDateText = (
    ytInitialData: InitialData,
    ytInitialPlayerResponse: InitialPlayerResponse,
  ) => {
    if (videoState === 4) {
      return ytInitialPlayerResponse.playabilityStatus.liveStreamability?.liveStreamabilityRenderer.offlineSlate?.liveStreamOfflineSlateRenderer.mainText.runs
        ?.map((r) => r.text)
        .join("");
    }

    const content =
      ytInitialData.contents.twoColumnWatchNextResults.results.results
        .contents[0]?.videoPrimaryInfoRenderer;

    if (videoState === 3) {
      return content?.dateText.simpleText;
    }
    return content?.relativeDateText?.simpleText;
  };

  const getIsLiveDVREnabled = (
    initialPlayerResponse: InitialPlayerResponse,
  ) => {
    return initialPlayerResponse.videoDetails.isLiveDvrEnabled == true;
  };

  const displayLiveDVRIndicator = (isDVREnabled: boolean) => {
    const existingIndicator = document.getElementById(
      "yt-enhancer-dvr-indicator",
    );
    if (existingIndicator) {
      existingIndicator.remove();
    }

    if (!isLiveNow || isDVREnabled) return;

    const timeWrapper = document.querySelector<HTMLElement>(
      "div.ytp-time-wrapper",
    );
    if (!timeWrapper) {
      console.warn("Time wrapper not found");
      return;
    }

    const indicator = document.createElement("div");
    indicator.id = "yt-enhancer-dvr-indicator";

    const separator = document.createElement("span");
    separator.textContent = "•";
    separator.style.cssText = `
      margin-right: 8px;
      font-size: 1.6rem;
    `;

    const text = document.createElement("span");
    text.textContent = "DVR disabled";

    indicator.appendChild(separator);
    indicator.appendChild(text);

    timeWrapper.appendChild(indicator);
  };

  const fetchAndLogVideoData = async (isUpdate: boolean = false) => {
    const data = await fetchVideoData(location.href);

    if (data.ytInitialData && data.ytInitialPlayerResponse) {
      try {
        const ytInitialDataObj = JSON.parse(data.ytInitialData) as InitialData;
        const ytInitialPlayerResponseObj: InitialPlayerResponse = JSON.parse(
          data.ytInitialPlayerResponse,
        );

        setVideoState(
          ytInitialPlayerResponseObj.microformat.playerMicroformatRenderer,
          ytInitialPlayerResponseObj.videoDetails,
        );

        const viewCount = getViewCount(ytInitialDataObj);
        const dateText = getDateText(
          ytInitialDataObj,
          ytInitialPlayerResponseObj,
        );

        console.log(
          "Video Title:",
          ytInitialPlayerResponseObj.videoDetails.title,
        );
        console.log("View Count:", viewCount);
        console.log("Date Text:", dateText);

        if (viewCount && dateText) {
          displayVideoInfo(viewCount, dateText, isUpdate);
        }

        if (isLiveNow) {
          const isDVREnabled = getIsLiveDVREnabled(ytInitialPlayerResponseObj);
          console.log("Is Live DVR Enabled:", isDVREnabled);

          await waitForElement("div.ytp-time-wrapper", 5000);
          displayLiveDVRIndicator(isDVREnabled);
        }

        if (player && !isLiveNow) {
          cleanupTimeTracking = setupTimeTracking(player);
          await restoreLastTime();
        }
      } catch (err) {
        console.warn("Failed to parse ytInitialData:", err);
      }
    }
  };

  const loopVideo = async (player: YouTubePlayer) => {
    if (autoLoopEnabled) player.setLoopVideo(true);
  };

  const setVideoResolution = async (player: YouTubePlayer) => {
    if (!qualityServiceEnabled) return;

    quality = (await storageBridge.get(qualityReferenceKey)) || "hd1080";
    await player.setPlaybackQualityRange(quality!);
    await delay(1000);
  };

  const watchVideoResolution = (player: YouTubePlayer) => {
    if (!player) return;

    if (qualityChangeListener) {
      player.removeEventListener(
        "onPlaybackQualityChange",
        qualityChangeListener,
      );
    }

    if (qualityServiceEnabled) {
      qualityChangeListener = (q: string) => {
        console.log("Quality Changed:", q);
        if (q !== quality) {
          quality = q;
          storageBridge.set(qualityReferenceKey, q);
        }
      };
      player.addEventListener("onPlaybackQualityChange", qualityChangeListener);
    }
  };

  const qualityService = async (player: YouTubePlayer) => {
    await setVideoResolution(player);
    watchVideoResolution(player);
  };

  const autoCaption = async (player: YouTubePlayer) => {
    if (autoCaptionEnabled) {
      player.toggleSubtitlesOn();
      isCaptionActive = true;
    }
  };

  const initConfig = async () => {
    const config = await storageBridge.get("dropdown_config");
    if (config) {
      autoLoopEnabled = config.autoLoop ?? true;
      qualityServiceEnabled = config.qualityService ?? true;
      autoCaptionEnabled = config.autoCaption ?? true;
    }
  };

  const handleVideo = async () => {
    player = await waitForPlayer();
    if (!player) return;

    await loopVideo(player);
    await qualityService(player);
    await autoCaption(player);
  };

  // ===== Event Listeners =====
  const settingListener = (event: Event) => {
    const { setting, value } = (event as CustomEvent).detail;

    if (setting === "autoLoop") {
      autoLoopEnabled = value;
      if (player) player.setLoopVideo(value);
    } else if (setting === "qualityService") {
      const wasEnabled = qualityServiceEnabled;
      qualityServiceEnabled = value;

      if (player) {
        if (value && !wasEnabled) {
          qualityService(player);
        } else if (!value && wasEnabled && qualityChangeListener) {
          player.removeEventListener(
            "onPlaybackQualityChange",
            qualityChangeListener,
          );
          qualityChangeListener = null;
        }
      }
    } else if (setting === "autoCaption") {
      autoCaptionEnabled = value;

      if (player) {
        if (value && !isCaptionActive) {
          player.toggleSubtitlesOn();
          isCaptionActive = true;
        } else if (!value && isCaptionActive) {
          player.toggleSubtitles();
          isCaptionActive = false;
        }
      }
    }
  };

  // ===== Module Interface =====
  return {
    match: (path: string) => path === "/watch",

    init: async () => {
      videoId = getVideoId();
      console.log("videoId:", videoId);
      await initConfig();

      const cleanupIntercept = setupNetworkIntercept();

      fetchAndLogVideoData();
      window.addEventListener("yt-enhancer-setting", settingListener);
      handleVideo();

      const handleBeforeUnload = () => {
        saveCurrentTime();
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          saveCurrentTime();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        saveCurrentTime();
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );

        window.removeEventListener("yt-enhancer-setting", settingListener);

        if (player && qualityChangeListener) {
          player.removeEventListener(
            "onPlaybackQualityChange",
            qualityChangeListener,
          );
        }

        if (cleanupTimeTracking) {
          cleanupTimeTracking();
          cleanupTimeTracking = null;
        }

        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }

        cleanupIntercept();

        document.getElementById("yt-enhancer-video-info")?.remove();
        document.getElementById("yt-enhancer-dvr-indicator")?.remove();

        videoId = null;
        videoState = null;
        player = null;
        quality = null;
        qualityChangeListener = null;
        isLiveNow = false;
        isCaptionActive = false;
        currentViewCount = 0;
        currentDateText = "";
        animationFrameId = null;
        lastSavedTime = 0;

        console.log("watch feature destroyed");
      };
    },

    fetchVideoData,
  };
})();
