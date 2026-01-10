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

export const watchFeature = (() => {
  let videoId: string | null = null;
  let ytInitialPlayerResponse: string | null = null;
  let ytInitialData: string | null = null;
  let videoState: number | null = null;
  let player: YouTubePlayer | null = null;
  let quality: string | null;
  let qualityReferenceKey = "quality_reference";

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
  let videoStartTime = 0;
  let cleanupTimeTracking: (() => void) | null = null;

  // ===== Utility Functions =====
  const fetchData = async (url: string) => {
    const res = await fetch(url);
    return res.text();
  };

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getVideoId = () =>
    new URLSearchParams(new URL(location.href).search).get("v");

  const waitForElement = async <T extends Element>(
    selector: string,
    timeout: number = 5000,
  ): Promise<T | null> => {
    const element = document.querySelector<T>(selector);
    if (element) return element;

    return new Promise((resolve) => {
      const startTime = Date.now();
      const observer = new MutationObserver(() => {
        const element = document.querySelector<T>(selector);
        if (element || Date.now() - startTime > timeout) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  };

  const saveCurrentTime = async () => {
    if (!player || !videoId) return;

    try {
      const currentTime = player.getCurrentTime();
      if (currentTime && currentTime > 0) {
        await storageBridge.set(`video_time_${videoId}`, currentTime);
        lastSavedTime = currentTime;
        console.log(`Saved time: ${currentTime}s for video ${videoId}`);
      }
    } catch (err) {
      console.warn("Failed to save current time:", err);
    }
  };

  const restoreLastTime = async () => {
    if (!player || !videoId) return;

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
    // 1. Save saat video di-pause
    const onPause = () => {
      saveCurrentTime();
    };

    // // 2. Save saat video playing (setiap timeupdate)
    // const onTimeUpdate = () => {
    //   const currentTime = player.getCurrentTime();
    //   // Simpan setiap 5 detik perubahan
    //   if (Math.abs(currentTime - lastSavedTime) >= 5) {
    //     saveCurrentTime();
    //   }
    // };

    // // 3. Save saat user seek
    // const onSeek = () => {
    //   saveCurrentTime();
    // };

    // 4. Save saat state berubah
    const onStateChange = (state: number) => {
      // State: 0 (ended), 1 (playing), 2 (paused)
      if (state === 2 || state === 0) {
        saveCurrentTime();
      }
    };

    player.addEventListener("onPause", onPause);
    player.addEventListener("onStateChange", onStateChange);

    // // Gunakan VideoProgress untuk tracking waktu
    // const progressListener = () => {
    //   onTimeUpdate();
    // };
    // player.addEventListener("onVideoProgress", progressListener);

    // Cleanup function
    return () => {
      player.removeEventListener("onPause", onPause);
      player.removeEventListener("onStateChange", onStateChange);
      // player.removeEventListener("onVideoProgress", progressListener);
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
        const [input, init] = args;
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
          const viewCountData = parseViewCountData(newViewCount);
          const viewCountElement = document.getElementById(
            "yt-enhancer-view-count",
          );

          if (
            viewCountElement &&
            viewCountData.count !== currentViewCount &&
            currentViewCount > 0
          ) {
            console.log("Auto-updating view count:", newViewCount);
            animateViewCount(
              viewCountElement,
              currentViewCount,
              viewCountData.count,
              viewCountData.formatted,
              viewCountData.useComma,
            );
          } else if (viewCountElement) {
            viewCountElement.textContent = viewCountData.formatted;
            currentViewCount = viewCountData.count;
          }
        }

        if (newDateText && newDateText !== currentDateText) {
          const dateTextElement = document.getElementById(
            "yt-enhancer-date-text",
          );
          if (dateTextElement) {
            console.log("Auto-updating date text:", newDateText);
            dateTextElement.textContent = newDateText;
          }
        }
      }
    }
  };

  // ===== Animation Functions =====
  const lerp = (start: number, end: number, t: number): number => {
    return start + (end - start) * t;
  };

  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  const parseViewCountData = (
    viewCountStr: string,
  ): { count: number; formatted: string; useComma: boolean } => {
    if (!viewCountStr) return { count: 0, formatted: "0", useComma: false };

    const formatted = viewCountStr;
    const lowerStr = viewCountStr.toLowerCase();

    const useComma =
      viewCountStr.includes(",") && !viewCountStr.match(/\d+\.\d+[KMB]/i);

    // Untuk parsing, ganti koma dengan titik jika ada, lalu hapus semua non-digit kecuali titik
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

  const formatViewCount = (
    currentNum: number,
    originalFormat: string,
    useComma: boolean,
  ): string => {
    const suffixMatch = originalFormat.match(/[\d.,\s]+(.*)/);
    const suffix = suffixMatch ? suffixMatch[1]?.trim() : "";
    const lowerOriginal = originalFormat.toLowerCase();

    if (lowerOriginal.includes("k")) {
      const value = (currentNum / 1000).toFixed(1);
      const formattedValue = useComma ? value.replace(".", ",") : value;
      return `${formattedValue}K${suffix ? " " + suffix : ""}`;
    } else if (lowerOriginal.includes("m")) {
      const value = (currentNum / 1000000).toFixed(1);
      const formattedValue = useComma ? value.replace(".", ",") : value;
      return `${formattedValue}M${suffix ? " " + suffix : ""}`;
    } else if (lowerOriginal.includes("jt")) {
      const value = (currentNum / 1000000).toFixed(1);
      const formattedValue = useComma ? value.replace(".", ",") : value;
      return `${formattedValue} jt${suffix ? " " + suffix : ""}`;
    } else if (
      lowerOriginal.includes("b") ||
      lowerOriginal.includes("miliar")
    ) {
      const value = (currentNum / 1000000000).toFixed(1);
      const formattedValue = useComma ? value.replace(".", ",") : value;
      return `${formattedValue}B${suffix ? " " + suffix : ""}`;
    }

    // Format full number
    let formattedNumber: string;
    if (useComma) {
      // Format dengan koma: 4,055 (gunakan en-US lalu ganti titik dengan koma)
      formattedNumber = currentNum.toLocaleString("en-US").replace(/\./g, ",");
    } else {
      // Format dengan titik: 4.055 (gunakan de-DE atau manual)
      formattedNumber = currentNum.toLocaleString("de-DE");
    }

    return `${formattedNumber}${suffix ? " " + suffix : ""}`;
  };

  const animateViewCount = (
    element: HTMLElement,
    fromValue: number,
    toValue: number,
    originalFormat: string,
    useComma: boolean,
  ) => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }

    const diff = Math.abs(toValue - fromValue);
    const base =
      diff < 10 ? 400 : Math.min(1400, 500 + Math.log10(diff + 1) * 300);

    const duration = base + 200 * Math.min(1, Math.log10(diff + 1));

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const currentValue = Math.round(lerp(fromValue, toValue, eased));

      element.textContent = formatViewCount(
        currentValue,
        originalFormat,
        useComma,
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        element.textContent = formatViewCount(
          toValue,
          originalFormat,
          useComma,
        );
        currentViewCount = toValue;
        animationFrameId = null;
      }
    };

    animationFrameId = requestAnimationFrame(animate);
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
      if (newViewCount !== currentViewCount && currentViewCount > 0) {
        animateViewCount(
          viewCountElement,
          currentViewCount,
          newViewCount,
          viewCountData.formatted,
          viewCountData.useComma,
        );
      } else {
        viewCountElement.textContent = viewCountData.formatted;
        currentViewCount = newViewCount;
      }

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
    infoWrapper.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 0.4rem;
    `;

    const infoContainer = document.createElement("div");
    infoContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0.8rem 1.2rem;
      font-size: 1.6rem;
      color: var(--yt-spec-text-primary);
      font-family: "Roboto", "Arial", sans-serif;
      font-weight: 600;
      background: rgba(255,255,255,.1);
      border-radius: 2rem;
    `;

    const viewCountSpan = document.createElement("span");
    viewCountSpan.id = "yt-enhancer-view-count";
    viewCountSpan.textContent = viewCountData.formatted;
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
    refreshButton.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.8rem;
      background: rgba(255,255,255,.1);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      color: var(--yt-spec-text-primary);
      transition: all 0.2s ease;
      width: 40px;
      height: 40px;
    `;

    refreshButton.onmouseenter = () =>
      (refreshButton.style.background = "rgba(255,255,255,.2)");
    refreshButton.onmouseleave = () =>
      (refreshButton.style.background = "rgba(255,255,255,.1)");

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

    ytInitialData = initialDataMatch?.[1] ?? null;
    ytInitialPlayerResponse = initialPlayerResponseMatch?.[1] ?? null;

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
      } catch (err) {
        console.warn("Failed to parse ytInitialData:", err);
      }
    }
  };

  const waitForPlayer = async (): Promise<YouTubePlayer> => {
    if (player) return player;

    const element = await waitForElement<HTMLElement>("#movie_player");

    if (!element) {
      throw new Error("Player element not found");
    }

    player = element as unknown as YouTubePlayer;

    return new Promise((resolve) => {
      const checkReady = setInterval(() => {
        if (typeof player!.getPlayerState === "function") {
          clearInterval(checkReady);
          resolve(player!);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkReady);
        resolve(player!);
      }, 3000);
    });
  };

  const initConfig = async () => {
    const config = await storageBridge.get("dropdown_config");
    if (config) {
      autoLoopEnabled = config.autoLoop ?? true;
      qualityServiceEnabled = config.qualityService ?? true;
      autoCaptionEnabled = config.autoCaption ?? true;
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

  const handleVideo = async () => {
    const player = await waitForPlayer();
    if (!player) return;

    await loopVideo(player);
    await qualityService(player);
    await autoCaption(player);

    cleanupTimeTracking = setupTimeTracking(player);
    await restoreLastTime();
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

        videoId = null;
        ytInitialPlayerResponse = null;
        ytInitialData = null;
        videoState = null;
        player = null;
        quality = null;
        qualityChangeListener = null;
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
