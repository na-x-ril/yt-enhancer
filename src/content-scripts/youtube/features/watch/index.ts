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
import { Odometer } from "odometer_countup";

type VideoState = {
  id: string | null;
  state: number | null;
  player: YouTubePlayer | null;
  isLiveNow: boolean;
  currentViewCount: number;
  currentDateText: string;
  lastSavedTime: number;
};

type Config = {
  autoLoop: boolean;
  autoCaption: boolean;
  qualityService: boolean;
  quality: string | null;
  isCaptionActive: boolean;
};

type Cleanup = {
  timeTracking: (() => void) | null;
  networkIntercept: (() => void) | null;
  countUp: CountUp | null;
};

export const watchFeature = (() => {
  const state: VideoState = {
    id: null,
    state: null,
    player: null,
    isLiveNow: false,
    currentViewCount: 0,
    currentDateText: "",
    lastSavedTime: 0,
  };

  const config: Config = {
    autoLoop: true,
    autoCaption: true,
    qualityService: true,
    quality: "hd1080",
    isCaptionActive: false,
  };

  const cleanup: Cleanup = {
    timeTracking: null,
    networkIntercept: null,
    countUp: null,
  };

  const timeTracking = {
    save: async () => {
      if (!state.player || !state.id || state.isLiveNow) return;

      try {
        const currentTime = state.player.getCurrentTime();
        const duration = state.player.getDuration();

        if (!currentTime || !duration) return;

        if (currentTime < 30 || duration - currentTime < 30) {
          await storageBridge.remove(`video_time_${state.id}`);
          state.lastSavedTime = 0;
          console.log(
            `Removed saved time for video ${state.id} (near start/end)`,
          );
          return;
        }

        if (
          currentTime > 0 &&
          Math.abs(currentTime - state.lastSavedTime) >= 3
        ) {
          await storageBridge.set(`video_time_${state.id}`, currentTime);
          state.lastSavedTime = currentTime;
          console.log(`Saved time: ${currentTime}s for video ${state.id}`);
        }
      } catch (err) {
        console.warn("Failed to save current time:", err);
      }
    },

    restore: async () => {
      if (!state.player || !state.id || state.isLiveNow) return;

      try {
        const savedTime = await storageBridge.get(`video_time_${state.id}`);
        const duration = state.player.getDuration();

        if (!savedTime || !duration) return;

        if (savedTime < 30 || duration - savedTime < 30) {
          await storageBridge.remove(`video_time_${state.id}`);
          console.log(`Removed invalid saved time for video ${state.id}`);
          return;
        }

        if (savedTime > 0) {
          state.player.seekTo(savedTime, true);
          console.log(`Restored time: ${savedTime}s for video ${state.id}`);
        }
      } catch (err) {
        console.warn("Failed to restore time:", err);
      }
    },

    setup: (player: YouTubePlayer) => {
      if (state.isLiveNow) return null;

      try {
        const handlers = {
          onPause: () => timeTracking.save(),
          onStateChange: (s: number) =>
            (s === 2 || s === 0) && timeTracking.save(),
        };

        player.addEventListener("onPause", handlers.onPause);
        player.addEventListener("onStateChange", handlers.onStateChange);

        return () => {
          player.removeEventListener("onPause", handlers.onPause);
          player.removeEventListener("onStateChange", handlers.onStateChange);
        };
      } catch (err) {
        console.warn("Failed to setup time tracking:", err);
        return null;
      }
    },
  };

  const viewCountParser = {
    parse: (viewCountStr: string): { count: number; formatted: string } => {
      if (!viewCountStr) return { count: 0, formatted: "0" };

      const lowerStr = viewCountStr.toLowerCase();
      const normalized = viewCountStr.replace(/\./g, "");
      const cleaned = normalized.replace(/[^\d]/g, "");

      let multiplier = 1;
      if (lowerStr.includes("k") || lowerStr.includes("rb")) multiplier = 1000;
      else if (lowerStr.includes("m") || lowerStr.includes("jt"))
        multiplier = 1000000;
      else if (lowerStr.includes("b") || lowerStr.includes("miliar"))
        multiplier = 1000000000;

      const num = parseFloat(cleaned);
      return {
        count: isNaN(num) ? 0 : Math.floor(num * multiplier),
        formatted: viewCountStr,
      };
    },

    extractSuffix: (viewCountString: string) => {
      if (!viewCountString) {
        return { number: 0, suffix: "", divisor: 1, decimalPlaces: 0 };
      }

      const lowerStr = viewCountString.toLowerCase();
      let divisor = 1;
      let decimalPlaces = 0;

      if (lowerStr.includes("k") || lowerStr.includes("rb")) {
        divisor = 1000;
        decimalPlaces = 1;
      } else if (lowerStr.includes("m") || lowerStr.includes("jt")) {
        divisor = 1000000;
        decimalPlaces = 1;
      } else if (lowerStr.includes("b") || lowerStr.includes("miliar")) {
        divisor = 1000000000;
        decimalPlaces = 1;
      }

      const numberMatch = viewCountString.match(/^[\d.,\s]+/);
      const numberPart = numberMatch ? numberMatch[0] : "";
      const suffixPart = viewCountString.slice(numberPart.length).trim();
      const suffix = suffixPart ? ` ${suffixPart}` : "";

      const parsed = viewCountParser.parse(viewCountString);

      return { number: parsed.count, suffix, divisor, decimalPlaces };
    },
  };

  const animation = {
    animate: (
      element: HTMLElement,
      fromValue: number,
      newViewCountString: string,
    ) => {
      try {
        const toValue = viewCountParser.parse(newViewCountString).count;

        if (toValue === fromValue || fromValue === 0) {
          animation.setStatic(element, toValue, newViewCountString);
          return;
        }

        if (cleanup.countUp) {
          cleanup.countUp.reset();
          cleanup.countUp = null;
        }

        const { suffix, divisor, decimalPlaces } =
          viewCountParser.extractSuffix(newViewCountString);
        const diff = Math.abs(toValue - fromValue);
        const base =
          diff < 10 ? 0.8 : Math.min(2.5, 1.0 + Math.log10(diff + 1) * 0.6);
        const duration = base + 0.4 * Math.min(1, Math.log10(diff + 1));

        const suffixElement = document.getElementById(
          "yt-enhancer-view-suffix",
        );
        if (suffixElement) suffixElement.textContent = suffix;

        const options = {
          startVal: fromValue / divisor,
          decimalPlaces: 0,
          duration,
          useGrouping: true,
          useEasing: true,
          smartEasingThreshold: 999,
          smartEasingAmount: 333,
          separator: ",",
          decimal: ".",
          plugin: new Odometer({
            duration: duration * 0.4,
            lastDigitDelay: 0.1,
          }),
          onCompleteCallback: () => {
            state.currentViewCount = toValue;
            cleanup.countUp = null;
          },
        };

        cleanup.countUp = new CountUp(element, toValue / divisor, options);

        if (!cleanup.countUp.error) {
          cleanup.countUp.start();
        } else {
          console.error("CountUp error:", cleanup.countUp.error);
          animation.setStatic(element, toValue, newViewCountString);
        }
      } catch (err) {
        console.warn("Failed to animate view count:", err);
      }
    },

    setStatic: (
      element: HTMLElement,
      toValue: number,
      newViewCountString: string,
    ) => {
      const { suffix, divisor, decimalPlaces } =
        viewCountParser.extractSuffix(newViewCountString);
      const formatted = (toValue / divisor)
        .toFixed(decimalPlaces)
        .replace(/\.0+$/, "");
      element.textContent = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const suffixElement = document.getElementById("yt-enhancer-view-suffix");
      if (suffixElement) suffixElement.textContent = suffix;

      state.currentViewCount = toValue;
    },
  };

  const networkIntercept = {
    setup: () => {
      const originalFetch = window.fetch;

      const fetchProxy = new Proxy(originalFetch, {
        apply: async (
          target,
          thisArg,
          args: [RequestInfo | URL, RequestInit?],
        ) => {
          const [input] = args;
          const response = await Reflect.apply(target, thisArg, args);

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
              if (data.actions) networkIntercept.handleUpdate(data.actions);
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
    },

    handleUpdate: (
      actions: Array<UpdateViewershipAction | UpdateDateTextAction>,
    ) => {
      try {
        let newViewCount: string | undefined;
        let newDateText: string | undefined;

        for (const action of actions) {
          if ("updateViewershipAction" in action) {
            const viewCountData =
              action.updateViewershipAction?.viewCount?.videoViewCountRenderer
                ?.viewCount;
            if (viewCountData) {
              newViewCount =
                viewCountData.simpleText ||
                viewCountData.runs?.map((r) => r.text).join("");
            }
          }

          if ("updateDateTextAction" in action) {
            const dateTextData = action.updateDateTextAction?.dateText;
            if (dateTextData) {
              newDateText =
                dateTextData.simpleText ||
                dateTextData.runs?.map((r) => r.text).join("");
            }
          }
        }

        if (newViewCount || newDateText) {
          const existingInfo = document.getElementById(
            "yt-enhancer-video-info",
          );
          if (existingInfo) {
            if (newViewCount) {
              const newCount = viewCountParser.parse(newViewCount).count;
              if (
                newCount !== state.currentViewCount &&
                state.currentViewCount > 0
              ) {
                const viewCountElement = document.getElementById(
                  "yt-enhancer-view-count",
                );
                if (viewCountElement) {
                  console.log("Auto-updating view count:", newViewCount);
                  animation.animate(
                    viewCountElement,
                    state.currentViewCount,
                    newViewCount,
                  );
                }
              } else if (state.currentViewCount === 0) {
                const viewCountElement = document.getElementById(
                  "yt-enhancer-view-count",
                );
                const suffixElement = document.getElementById(
                  "yt-enhancer-view-suffix",
                );
                if (viewCountElement && suffixElement) {
                  animation.setStatic(viewCountElement, newCount, newViewCount);
                }
              }
            }

            if (newDateText && newDateText !== state.currentDateText) {
              const dateTextElement = document.getElementById(
                "yt-enhancer-date-text",
              );
              if (dateTextElement) {
                console.log("Auto-updating date text:", newDateText);
                dateTextElement.textContent = newDateText;
                state.currentDateText = newDateText;
              }
            }
          }
        }
      } catch (err) {
        console.warn("Failed to handle YouTube update:", err);
      }
    },
  };

  const ui = {
    displayVideoInfo: async (
      viewCount: string,
      dateText: string,
      isUpdate = false,
    ) => {
      try {
        const newViewCount = viewCountParser.parse(viewCount).count;
        const existingInfo = document.getElementById("yt-enhancer-video-info");
        const viewCountElement = document.getElementById(
          "yt-enhancer-view-count",
        );

        if (isUpdate && existingInfo && viewCountElement) {
          if (newViewCount !== state.currentViewCount) {
            animation.animate(
              viewCountElement,
              state.currentViewCount,
              viewCount,
            );
          }

          const dateTextElement = document.getElementById(
            "yt-enhancer-date-text",
          );
          if (dateTextElement && dateText !== state.currentDateText) {
            dateTextElement.textContent = dateText;
            state.currentDateText = dateText;
          }
          return;
        }

        if (existingInfo) existingInfo.remove();
        state.currentViewCount = newViewCount;
        state.currentDateText = dateText;

        const titleElement = await waitForElement(
          "#above-the-fold > div#title",
        );
        if (!titleElement) return;

        const { suffix, divisor, decimalPlaces } =
          viewCountParser.extractSuffix(viewCount);

        const infoWrapper = document.createElement("div");
        infoWrapper.id = "yt-enhancer-video-info";

        const infoContainer = document.createElement("div");
        infoContainer.id = "info-container";

        const viewCountContainer = document.createElement("span");
        viewCountContainer.id = "viewcount-container";

        const viewCountSpan = document.createElement("span");
        viewCountSpan.id = "yt-enhancer-view-count";
        const formatted = (newViewCount / divisor)
          .toFixed(decimalPlaces)
          .replace(/\.0+$/, "");
        viewCountSpan.textContent = formatted.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ",",
        );
        viewCountSpan.style.fontVariantNumeric = "tabular-nums";

        const suffixSpan = document.createElement("span");
        suffixSpan.id = "yt-enhancer-view-suffix";
        suffixSpan.textContent = suffix;

        viewCountContainer.append(viewCountSpan, suffixSpan);

        const separator = document.createElement("span");
        separator.textContent = "•";

        const dateTextSpan = document.createElement("span");
        dateTextSpan.id = "yt-enhancer-date-text";
        dateTextSpan.textContent = dateText;

        infoContainer.append(viewCountContainer, separator, dateTextSpan);

        const refreshButton = ui.createRefreshButton();
        infoWrapper.append(infoContainer, refreshButton);
        titleElement.insertAdjacentElement("afterend", infoWrapper);
      } catch (err) {
        console.warn("Failed to display video info:", err);
      }
    },

    createRefreshButton: () => {
      const button = document.createElement("button");
      button.id = "yt-enhancer-refresh-btn";
      button.innerHTML = `
        <svg height="28" viewBox="0 0 24 24" width="28" focusable="false">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"></path>
        </svg>
      `;

      button.onclick = async () => {
        try {
          button.style.pointerEvents = "none";
          button.style.opacity = "0.5";

          const svg = button.querySelector<SVGElement>("svg");
          if (svg) {
            svg.style.transition = "transform 0.5s ease";
            svg.style.transform = "rotate(360deg)";
          }

          await videoData.fetchAndLog(true);

          setTimeout(() => {
            button.style.pointerEvents = "auto";
            button.style.opacity = "1";
            if (svg) svg.style.transform = "rotate(0deg)";
          }, 500);
        } catch (err) {
          console.warn("Failed to refresh video data:", err);
          button.style.pointerEvents = "auto";
          button.style.opacity = "1";
        }
      };

      return button;
    },

    displayDVRIndicator: (isDVREnabled: boolean) => {
      try {
        const existing = document.getElementById("yt-enhancer-dvr-indicator");
        if (existing) existing.remove();
        if (!state.isLiveNow || isDVREnabled) return;

        const timeWrapper = document.querySelector<HTMLElement>(
          "div.ytp-time-wrapper",
        );
        if (!timeWrapper) return;

        const indicator = document.createElement("div");
        indicator.id = "yt-enhancer-dvr-indicator";

        const separator = document.createElement("span");
        separator.textContent = "•";
        separator.style.cssText = "margin-right: 8px; font-size: 1.6rem;";

        const text = document.createElement("span");
        text.textContent = "DVR disabled";

        indicator.append(separator, text);
        timeWrapper.appendChild(indicator);
      } catch (err) {
        console.warn("Failed to display DVR indicator:", err);
      }
    },
  };

  const videoData = {
    parse: (html: string) => {
      const initialDataMatch = html.match(/var ytInitialData\s*=\s*(\{.*?\});/);
      const initialPlayerResponseMatch = html.match(
        /var ytInitialPlayerResponse\s*=\s*(\{.*?\});/,
      );

      return {
        ytInitialData: initialDataMatch?.[1] ?? null,
        ytInitialPlayerResponse: initialPlayerResponseMatch?.[1] ?? null,
      };
    },

    fetch: async (url: string) => {
      const html = await fetchData(url);
      return videoData.parse(html);
    },

    setState: (
      microformat: PlayerMicroformatRenderer,
      videoDetails: InitialPlayerResponseVideoDetails,
    ) => {
      const liveDetails = microformat?.liveBroadcastDetails;

      if (liveDetails?.isLiveNow === true) {
        state.state = 3;
        state.isLiveNow = true;
      } else if (liveDetails?.isLiveNow === false && !videoDetails.isUpcoming) {
        state.state = 2;
      } else if (liveDetails?.isLiveNow === false && videoDetails.isUpcoming) {
        state.state = 4;
      } else {
        state.state = 1;
      }
    },

    getViewCount: (data: InitialData) => {
      const content =
        data.contents.twoColumnWatchNextResults.results.results.contents[0]
          ?.videoPrimaryInfoRenderer?.viewCount.videoViewCountRenderer
          .viewCount;
      return state.state === 4 || state.state === 3
        ? content?.runs?.map((r) => r.text).join("")
        : content?.simpleText;
    },

    getDateText: (
      ytInitialData: InitialData,
      ytInitialPlayerResponse: InitialPlayerResponse,
    ) => {
      if (state.state === 4) {
        return ytInitialPlayerResponse.playabilityStatus.liveStreamability?.liveStreamabilityRenderer.offlineSlate?.liveStreamOfflineSlateRenderer.mainText.runs
          ?.map((r) => r.text)
          .join("");
      }

      const content =
        ytInitialData.contents.twoColumnWatchNextResults.results.results
          .contents[0]?.videoPrimaryInfoRenderer;
      return state.state === 3
        ? content?.dateText.simpleText
        : content?.relativeDateText?.simpleText;
    },

    getDVREnabled: (response: InitialPlayerResponse) =>
      response.videoDetails.isLiveDvrEnabled === true,

    fetchAndLog: async (isUpdate = false) => {
      try {
        const data = await videoData.fetch(location.href);

        if (data.ytInitialData && data.ytInitialPlayerResponse) {
          const ytInitialDataObj = JSON.parse(
            data.ytInitialData,
          ) as InitialData;
          const ytInitialPlayerResponseObj: InitialPlayerResponse = JSON.parse(
            data.ytInitialPlayerResponse,
          );

          videoData.setState(
            ytInitialPlayerResponseObj.microformat.playerMicroformatRenderer,
            ytInitialPlayerResponseObj.videoDetails,
          );

          const viewCount = videoData.getViewCount(ytInitialDataObj);
          const dateText = videoData.getDateText(
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
            await ui.displayVideoInfo(viewCount, dateText, isUpdate);
          }

          if (state.isLiveNow) {
            const isDVREnabled = videoData.getDVREnabled(
              ytInitialPlayerResponseObj,
            );
            console.log("Is Live DVR Enabled:", isDVREnabled);
            await waitForElement("div.ytp-time-wrapper", 5000);
            ui.displayDVRIndicator(isDVREnabled);
          }

          if (state.player && !state.isLiveNow && !isUpdate) {
            cleanup.timeTracking = timeTracking.setup(state.player);
            await timeTracking.restore();
          }
        }
      } catch (err) {
        console.warn("Failed to fetch video data:", err);
      }
    },
  };

  const playerFeatures = {
    applyAll: async (player: YouTubePlayer) => {
      try {
        await playerFeatures.loop(player);
        await playerFeatures.caption(player);
        if (config.quality) {
          await playerFeatures.setQuality(player, config.quality);
        }
        console.log("All player features applied");
      } catch (err) {
        console.warn("Failed to apply all features:", err);
      }
    },

    loop: async (player: YouTubePlayer) => {
      try {
        if (config.autoLoop) player.setLoopVideo(true);
      } catch (err) {
        console.warn("Failed to set loop video:", err);
      }
    },

    setQuality: async (player: YouTubePlayer, quality: string) => {
      try {
        if (!config.qualityService) return;
        await player.setPlaybackQualityRange(quality);
        console.log("Quality set to:", quality);
      } catch (err) {
        console.warn("Failed to set video resolution:", err);
      }
    },

    caption: async (player: YouTubePlayer) => {
      try {
        if (config.autoCaption) {
          player.toggleSubtitlesOn();
          config.isCaptionActive = true;
        }
      } catch (err) {
        console.warn("Failed to toggle auto caption:", err);
      }
    },
  };

  const configManager = {
    load: async () => {
      try {
        const saved = await storageBridge.get("dropdown_config");
        if (saved) {
          config.autoLoop = saved.autoLoop ?? true;
          config.qualityService = saved.qualityService ?? true;
          config.autoCaption = saved.autoCaption ?? true;
          config.quality = saved.preferredQuality ?? "hd1080";
        }
      } catch (err) {
        console.warn("Failed to init config:", err);
      }
    },
  };

  const eventHandlers = {
    refresh: async () => {
      try {
        console.log("Refreshing player features...");

        if (!state.player) {
          state.player = await waitForPlayer();
        }

        if (state.player) {
          await playerFeatures.applyAll(state.player);

          if (!state.isLiveNow) {
            cleanup.timeTracking?.();
            cleanup.timeTracking = timeTracking.setup(state.player);
          }
        }

        console.log("Player features refreshed successfully");
      } catch (err) {
        console.warn("Failed to refresh player features:", err);
      }
    },

    setting: (event: Event) => {
      try {
        const { setting, value } = (event as CustomEvent).detail;

        if (setting === "autoLoop") {
          config.autoLoop = value;
          if (state.player) state.player.setLoopVideo(value);
        } else if (setting === "qualityService") {
          config.qualityService = value;
          if (value && state.player && config.quality) {
            playerFeatures.setQuality(state.player, config.quality);
          }
        } else if (setting === "autoCaption") {
          config.autoCaption = value;
          if (state.player) {
            if (value && !config.isCaptionActive) {
              state.player.toggleSubtitlesOn();
              config.isCaptionActive = true;
            } else if (!value && config.isCaptionActive) {
              state.player.toggleSubtitles();
              config.isCaptionActive = false;
            }
          }
        }
      } catch (err) {
        console.warn("Failed to handle setting change:", err);
      }
    },

    quality: (event: Event) => {
      try {
        const { quality: newQuality } = (event as CustomEvent).detail;
        config.quality = newQuality;
        if (state.player && config.qualityService) {
          playerFeatures.setQuality(state.player, newQuality);
        }
      } catch (err) {
        console.warn("Failed to handle quality change:", err);
      }
    },
  };

  const handleVideo = async () => {
    try {
      state.player = await waitForPlayer();
      if (!state.player) return;

      await playerFeatures.applyAll(state.player);
    } catch (err) {
      console.warn("Failed to handle video:", err);
    }
  };

  const resetState = () => {
    state.id = null;
    state.state = null;
    state.player = null;
    state.isLiveNow = false;
    config.isCaptionActive = false;
    state.currentViewCount = 0;
    state.currentDateText = "";
    state.lastSavedTime = 0;
  };

  return {
    match: (path: string) => path === "/watch",

    init: async () => {
      state.id = getVideoId();
      console.log("videoId:", state.id);
      await configManager.load();

      cleanup.networkIntercept = networkIntercept.setup();
      videoData.fetchAndLog();

      window.addEventListener("yt-enhancer-setting", eventHandlers.setting);
      window.addEventListener("yt-enhancer-quality", eventHandlers.quality);
      window.addEventListener("yt-enhancer-refresh", eventHandlers.refresh);

      const handleBeforeUnload = () => timeTracking.save();
      const handleVisibilityChange = () =>
        document.hidden && timeTracking.save();

      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      handleVideo();

      return () => {
        timeTracking.save();
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener(
          "yt-enhancer-setting",
          eventHandlers.setting,
        );
        window.removeEventListener(
          "yt-enhancer-quality",
          eventHandlers.quality,
        );
        window.removeEventListener(
          "yt-enhancer-refresh",
          eventHandlers.refresh,
        );
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );

        cleanup.timeTracking?.();
        cleanup.countUp?.reset();
        cleanup.networkIntercept?.();

        document.getElementById("yt-enhancer-video-info")?.remove();
        document.getElementById("yt-enhancer-dvr-indicator")?.remove();

        resetState();
        cleanup.timeTracking = null;
        cleanup.countUp = null;
        console.log("watch feature destroyed");
      };
    },

    fetchVideoData: videoData.fetch,
  };
})();
