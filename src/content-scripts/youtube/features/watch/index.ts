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
  ResultsContent,
  UpdateDateTextAction,
  UpdateViewershipAction,
  YouTubeUpdateResponse,
} from "../../types/videoData";
import {
  fetchData,
  getVideoId,
  waitForElement,
  waitForPlayer,
} from "../../utils";
import { CountUp } from "countup.js";
import { Odometer } from "odometer_countup";

interface State {
  id: string | null;
  state: number | null;
  player: YouTubePlayer | null;
  isLiveNow: boolean;
  currentViewCount: number;
  currentDateText: string;
  lastSavedTime: number;
  isDestroyed: boolean;
  isCaptionActive: boolean;
}

interface Config {
  autoLoop: boolean;
  autoCaption: boolean;
  qualityService: boolean;
  quality: string;
}

const state: State = {
  id: null,
  state: null,
  player: null,
  isLiveNow: false,
  currentViewCount: 0,
  currentDateText: "",
  lastSavedTime: 0,
  isDestroyed: false,
  isCaptionActive: false,
};

const config: Config = {
  autoLoop: true,
  autoCaption: true,
  qualityService: true,
  quality: "hd1080",
};

const cleanup: {
  timeTracking: (() => void) | null;
  countUp: CountUp | null;
  handlers: Array<() => void>;
} = {
  timeTracking: null,
  countUp: null,
  handlers: [],
};

function resetState() {
  state.id = null;
  state.state = null;
  state.player = null;
  state.isLiveNow = false;
  state.currentViewCount = 0;
  state.currentDateText = "";
  state.lastSavedTime = 0;
  state.isDestroyed = false;
  state.isCaptionActive = false;
}

function runCleanup() {
  state.isDestroyed = true;

  cleanup.timeTracking?.();
  cleanup.timeTracking = null;

  cleanup.countUp?.reset();
  cleanup.countUp = null;

  cleanup.handlers.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
  cleanup.handlers = [];

  document.getElementById("yt-enhancer-video-info")?.remove();
  document.getElementById("yt-enhancer-dvr-indicator")?.remove();

  resetState();
}

const viewCountParser = {
  parse: (viewCountStr: string): { count: number; formatted: string } => {
    if (!viewCountStr) return { count: 0, formatted: "0" };

    const lowerStr = viewCountStr.toLowerCase();
    let multiplier = 1;
    if (lowerStr.includes("k") || lowerStr.includes("rb")) multiplier = 1000;
    else if (lowerStr.includes("m") || lowerStr.includes("jt"))
      multiplier = 1_000_000;
    else if (lowerStr.includes("b") || lowerStr.includes("miliar"))
      multiplier = 1_000_000_000;

    const numberMatch = viewCountStr.match(/[\d.,]+/);
    if (!numberMatch) return { count: 0, formatted: viewCountStr };

    const num = parseFloat(numberMatch[0].replace(/,/g, ""));
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
      divisor = 1_000_000;
      decimalPlaces = 1;
    } else if (lowerStr.includes("b") || lowerStr.includes("miliar")) {
      divisor = 1_000_000_000;
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

const timeTracking = {
  save: async () => {
    if (state.isDestroyed || !state.player || !state.id || state.isLiveNow)
      return;
    try {
      const currentTime = state.player.getCurrentTime();
      const duration = state.player.getDuration();
      if (!currentTime || !duration) return;

      const key = `video_time_${state.id}`;
      if (currentTime < 30 || duration - currentTime < 30) {
        await storageBridge.remove(key);
        state.lastSavedTime = 0;
        return;
      }

      if (Math.abs(currentTime - state.lastSavedTime) >= 3) {
        await storageBridge.set(key, currentTime);
        state.lastSavedTime = currentTime;
      }
    } catch {}
  },
  restore: async () => {
    if (state.isDestroyed || !state.player || !state.id || state.isLiveNow)
      return;
    try {
      const key = `video_time_${state.id}`;
      const savedTime = await storageBridge.get(key);
      const duration = state.player.getDuration();
      if (!savedTime || !duration) return;

      if (savedTime < 30 || duration - savedTime < 30) {
        await storageBridge.remove(key);
        return;
      }

      state.player.seekTo(savedTime, true);
    } catch {}
  },
  setup: (player: YouTubePlayer) => {
    if (state.isDestroyed || state.isLiveNow) return null;
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
    } catch {
      return null;
    }
  },
};

const animation = {
  animate: (
    element: HTMLElement,
    fromValue: number,
    newViewCountString: string,
  ) => {
    if (state.isDestroyed) return;
    try {
      const toValue = viewCountParser.parse(newViewCountString).count;
      if (toValue === fromValue || fromValue === 0) {
        animation.setStatic(element, toValue, newViewCountString);
        return;
      }

      cleanup.countUp?.reset();

      const { suffix, divisor, decimalPlaces } =
        viewCountParser.extractSuffix(newViewCountString);
      const diff = Math.abs(toValue - fromValue);
      const base =
        diff < 10 ? 0.8 : Math.min(2.5, 1.0 + Math.log10(diff + 1) * 0.6);
      const duration = base + 0.4 * Math.min(1, Math.log10(diff + 1));

      const suffixElement = document.getElementById("yt-enhancer-view-suffix");
      if (suffixElement) suffixElement.textContent = suffix;

      cleanup.countUp = new CountUp(element, toValue / divisor, {
        startVal: fromValue / divisor,
        decimalPlaces,
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
          if (!state.isDestroyed) {
            state.currentViewCount = toValue;
          }
          cleanup.countUp = null;
        },
      });

      if (!cleanup.countUp.error) {
        cleanup.countUp.start();
      } else {
        animation.setStatic(element, toValue, newViewCountString);
      }
    } catch {
      animation.setStatic(
        element,
        viewCountParser.parse(newViewCountString).count,
        newViewCountString,
      );
    }
  },
  setStatic: (
    element: HTMLElement,
    toValue: number,
    newViewCountString: string,
  ) => {
    if (state.isDestroyed) return;
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

const networkIntercept = (() => {
  let isSetup = false;

  return {
    setup: () => {
      if (isSetup) return;
      isSetup = true;

      const originalFetch = window.fetch;

      window.fetch = new Proxy(originalFetch, {
        apply: async (
          target,
          thisArg,
          args: [RequestInfo | URL, RequestInit?],
        ) => {
          const [input] = args;
          const response = await Reflect.apply(target, thisArg, args);

          if (state.isDestroyed) return response;

          const url =
            typeof input === "string"
              ? input
              : input instanceof URL
                ? input.href
                : (input as Request).url;

          if (url?.includes("/youtubei/v1/updated_metadata")) {
            try {
              const data: YouTubeUpdateResponse = await response.clone().json();
              if (data.actions && !state.isDestroyed) {
                networkIntercept.handleUpdate(data.actions);
              }
            } catch {}
          }

          return response;
        },
      });
    },
    handleUpdate: (
      actions: Array<UpdateViewershipAction | UpdateDateTextAction>,
    ) => {
      if (state.isDestroyed) return;
      try {
        const viewershipAction = actions.find(
          (action): action is UpdateViewershipAction =>
            "updateViewershipAction" in action,
        );
        const dateTextAction = actions.find(
          (action): action is UpdateDateTextAction =>
            "updateDateTextAction" in action,
        );

        const newViewCount =
          viewershipAction?.updateViewershipAction?.viewCount
            ?.videoViewCountRenderer?.viewCount;
        const newDateText = dateTextAction?.updateDateTextAction?.dateText;

        const viewCountString = newViewCount
          ? newViewCount.simpleText ||
            newViewCount.runs?.map((r) => r.text).join("")
          : undefined;
        const dateTextString = newDateText
          ? newDateText.simpleText ||
            newDateText.runs?.map((r) => r.text).join("")
          : undefined;

        if (viewCountString || dateTextString) {
          ui.displayVideoInfo(
            viewCountString ?? "",
            dateTextString ?? state.currentDateText,
            true,
          );
        }
      } catch {}
    },
  };
})();

const ui = {
  displayVideoInfo: async (
    viewCount: string,
    dateText: string,
    isUpdate = false,
  ) => {
    if (state.isDestroyed) return;
    try {
      if (!viewCount) return;

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

      existingInfo?.remove();

      state.currentViewCount = newViewCount;
      state.currentDateText = dateText;

      const titleElement = await waitForElement("#above-the-fold > div#title");
      if (state.isDestroyed || !titleElement) return;

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
      infoWrapper.append(infoContainer, ui.createRefreshButton());
      titleElement.insertAdjacentElement("afterend", infoWrapper);
    } catch {}
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
      if (state.isDestroyed) return;
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
          if (state.isDestroyed) return;
          button.style.pointerEvents = "auto";
          button.style.opacity = "1";
          if (svg) svg.style.transform = "rotate(0deg)";
        }, 500);
      } catch {
        button.style.pointerEvents = "auto";
        button.style.opacity = "1";
      }
    };

    return button;
  },
  displayDVRIndicator: (isDVREnabled: boolean) => {
    if (state.isDestroyed) return;
    try {
      const existing = document.getElementById("yt-enhancer-dvr-indicator");
      existing?.remove();

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
    } catch {}
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

  findVideoPrimaryInfo: (
    contents: ResultsContent[],
  ): ResultsContent | undefined => {
    return contents.find(
      (
        item,
      ): item is ResultsContent & {
        videoPrimaryInfoRenderer: NonNullable<
          ResultsContent["videoPrimaryInfoRenderer"]
        >;
      } => item.videoPrimaryInfoRenderer !== undefined,
    );
  },

  getViewCount: (data: InitialData) => {
    const contents =
      data.contents.twoColumnWatchNextResults.results.results.contents;
    const videoPrimaryInfo = videoData.findVideoPrimaryInfo(contents);

    if (!videoPrimaryInfo?.videoPrimaryInfoRenderer) {
      return null;
    }

    const content =
      videoPrimaryInfo.videoPrimaryInfoRenderer?.viewCount
        .videoViewCountRenderer.viewCount;

    return state.state === 4 || state.state === 3
      ? (content?.runs?.map((r) => r.text).join("") ?? null)
      : (content?.simpleText ?? null);
  },

  getDateText: (
    ytInitialData: InitialData,
    ytInitialPlayerResponse: InitialPlayerResponse,
  ) => {
    if (state.state === 4) {
      return (
        ytInitialPlayerResponse.playabilityStatus.liveStreamability?.liveStreamabilityRenderer.offlineSlate?.liveStreamOfflineSlateRenderer.mainText.runs
          ?.map((r) => r.text)
          .join("") ?? null
      );
    }

    const contents =
      ytInitialData.contents.twoColumnWatchNextResults.results.results.contents;
    const videoPrimaryInfo = videoData.findVideoPrimaryInfo(contents);

    if (!videoPrimaryInfo?.videoPrimaryInfoRenderer) {
      return null;
    }

    const content = videoPrimaryInfo.videoPrimaryInfoRenderer;
    return state.state === 3
      ? (content?.dateText?.simpleText ?? null)
      : (content?.relativeDateText?.simpleText ?? null);
  },

  getDVREnabled: (response: InitialPlayerResponse) =>
    response.videoDetails.isLiveDvrEnabled === true,

  fetchAndLog: async (isUpdate = false) => {
    if (state.isDestroyed) return;
    try {
      const data = await videoData.fetch(location.href);

      if (state.isDestroyed) return;

      if (data.ytInitialData && data.ytInitialPlayerResponse) {
        const ytInitialDataObj = JSON.parse(data.ytInitialData) as InitialData;
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

        if (state.isDestroyed) return;

        if (viewCount && dateText) {
          await ui.displayVideoInfo(viewCount, dateText, isUpdate);
        }

        if (state.isLiveNow) {
          const isDVREnabled = videoData.getDVREnabled(
            ytInitialPlayerResponseObj,
          );
          await waitForElement("div.ytp-time-wrapper", 5000);
          if (!state.isDestroyed) {
            ui.displayDVRIndicator(isDVREnabled);
          }
        }

        if (
          state.player &&
          !state.isLiveNow &&
          !isUpdate &&
          !state.isDestroyed
        ) {
          cleanup.timeTracking = timeTracking.setup(state.player);
          await timeTracking.restore();
        }
      }
    } catch {}
  },
};

const playerFeatures = {
  applyAll: async (player: YouTubePlayer) => {
    if (state.isDestroyed) return;
    try {
      playerFeatures.loop(player);
      playerFeatures.caption(player);
      await playerFeatures.setQuality(player, config.quality);
    } catch {}
  },
  loop: (player: YouTubePlayer) => {
    if (state.isDestroyed) return;
    try {
      if (config.autoLoop) player.setLoopVideo(true);
    } catch {}
  },
  setQuality: async (player: YouTubePlayer, quality: string) => {
    if (state.isDestroyed) return;
    try {
      if (!config.qualityService) return;
      await player.setPlaybackQualityRange(quality);
    } catch {}
  },
  caption: (player: YouTubePlayer) => {
    if (state.isDestroyed) return;
    try {
      if (config.autoCaption) {
        player.toggleSubtitlesOn();
        state.isCaptionActive = true;
      }
    } catch {}
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
    } catch {}
  },
};

const eventHandlers = {
  refresh: async () => {
    if (state.isDestroyed) return;
    try {
      const currentId = getVideoId();
      if (currentId !== state.id) {
        runCleanup();
        return;
      }

      if (!state.player) {
        state.player = await waitForPlayer();
      }
      if (state.player && !state.isDestroyed) {
        await playerFeatures.applyAll(state.player);
        if (!state.isLiveNow) {
          cleanup.timeTracking?.();
          cleanup.timeTracking = timeTracking.setup(state.player);
        }
      }
    } catch {}
  },
  setting: (event: Event) => {
    if (state.isDestroyed) return;
    try {
      const { setting, value } = (event as CustomEvent).detail;
      if (!state.player) return;

      if (setting === "autoLoop") {
        config.autoLoop = value;
        state.player.setLoopVideo(value);
      } else if (setting === "qualityService") {
        config.qualityService = value;
        if (value && config.quality) {
          playerFeatures.setQuality(state.player, config.quality);
        }
      } else if (setting === "autoCaption") {
        config.autoCaption = value;
        if (value && !state.isCaptionActive) {
          state.player.toggleSubtitlesOn();
          state.isCaptionActive = true;
        } else if (!value && state.isCaptionActive) {
          state.player.toggleSubtitles();
          state.isCaptionActive = false;
        }
      }
    } catch {}
  },
  quality: (event: Event) => {
    if (state.isDestroyed) return;
    try {
      const { quality: newQuality } = (event as CustomEvent).detail;
      config.quality = newQuality;
      if (state.player && config.qualityService) {
        playerFeatures.setQuality(state.player, newQuality);
      }
    } catch {}
  },
};

const handleVideo = async () => {
  if (state.isDestroyed) return;
  try {
    if (!state.player) {
      state.player = await waitForPlayer();
    }
    if (state.player && !state.isDestroyed) {
      await playerFeatures.applyAll(state.player);
    }
  } catch {}
};

export const watchFeature = {
  match: (path: string) => path === "/watch",
  init: async () => {
    const currentId = getVideoId();
    const previousId = state.id;

    if (previousId && previousId !== currentId) {
      console.log(`[YT Enhancer] Video changed: ${previousId} → ${currentId}`);
      runCleanup();
    } else if (previousId === currentId) {
      console.log(
        `[YT Enhancer] Warning: Same video init called: ${currentId}`,
      );
    } else {
      console.log(`[YT Enhancer] New video loaded: ${currentId}`);
    }

    if (state.isDestroyed) {
      resetState();
    }

    state.id = currentId;
    await configManager.load();
    networkIntercept.setup();

    await videoData.fetchAndLog();

    const handleBeforeUnload = () => timeTracking.save();
    const handleVisibilityChange = () => document.hidden && timeTracking.save();

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("yt-enhancer-setting", eventHandlers.setting);
    window.addEventListener("yt-enhancer-quality", eventHandlers.quality);
    window.addEventListener("yt-enhancer-refresh", eventHandlers.refresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    cleanup.handlers.push(
      () => window.removeEventListener("beforeunload", handleBeforeUnload),
      () =>
        window.removeEventListener(
          "yt-enhancer-setting",
          eventHandlers.setting,
        ),
      () =>
        window.removeEventListener(
          "yt-enhancer-quality",
          eventHandlers.quality,
        ),
      () =>
        window.removeEventListener(
          "yt-enhancer-refresh",
          eventHandlers.refresh,
        ),
      () =>
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        ),
    );

    await handleVideo();

    return () => {
      console.log(`[YT Enhancer] Cleaning up for video: ${state.id}`);
      runCleanup();
    };
  },
  fetchVideoData: videoData.fetch,
};
