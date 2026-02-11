// src/content-scripts/youtube/utils/index.ts
import type { YouTubePlayer } from "../types";

export const fetchData = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.text();
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getVideoId = (): string | null =>
  new URLSearchParams(new URL(location.href).search).get("v");

export const waitForElement = async <T extends Element>(
  selector: string,
  timeout = 5000,
): Promise<T | null> => {
  const existing = document.querySelector<T>(selector);
  if (existing) return existing;

  return new Promise((resolve) => {
    let activeElapsed = 0;
    let lastTick = Date.now();

    const cleanup = () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(interval);
    };

    const tryResolve = () => {
      const element = document.querySelector<T>(selector);
      if (element) {
        cleanup();
        resolve(element);
      }
    };

    const onVisibilityChange = () => {
      lastTick = Date.now();
    };

    const observer = new MutationObserver(tryResolve);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    const interval = setInterval(() => {
      const now = Date.now();
      if (!document.hidden) {
        activeElapsed += now - lastTick;
      }
      lastTick = now;

      if (activeElapsed >= timeout) {
        cleanup();
        resolve(null);
      }
    }, 100);
  });
};

const REQUIRED_METHODS = [
  "getPlayerState",
  "getCurrentTime",
  "getDuration",
  "setPlaybackQualityRange",
  "setLoopVideo",
  "toggleSubtitlesOn",
  "toggleSubtitles",
  "addEventListener",
  "removeEventListener",
  "seekTo",
] as const;

const BUFFERING_STATES = new Set([-1, 3]);
const READY_STATES = new Set([1, 2]);

interface PlayerReadinessCheck {
  isReady: boolean;
  isBuffering: boolean;
  canRetry: boolean;
}

const checkPlayerReadiness = (player: YouTubePlayer): PlayerReadinessCheck => {
  try {
    const allMethodsExist = REQUIRED_METHODS.every(
      (method) => typeof player[method] === "function",
    );

    if (!allMethodsExist) {
      return { isReady: false, isBuffering: false, canRetry: true };
    }

    const state = player.getPlayerState();
    const duration = player.getDuration();

    if (BUFFERING_STATES.has(state)) {
      return { isReady: false, isBuffering: true, canRetry: true };
    }

    if (
      READY_STATES.has(state) &&
      (typeof duration !== "number" || duration <= 0)
    ) {
      return { isReady: false, isBuffering: true, canRetry: true };
    }

    if (READY_STATES.has(state) && duration > 0) {
      return { isReady: true, isBuffering: false, canRetry: false };
    }

    return { isReady: false, isBuffering: false, canRetry: true };
  } catch {
    return { isReady: false, isBuffering: false, canRetry: true };
  }
};

export const waitForPlayer = async (
  options: {
    baseTimeout?: number;
    maxTimeout?: number;
    exponentialBackoff?: boolean;
  } = {},
): Promise<YouTubePlayer> => {
  const {
    baseTimeout = 10000,
    maxTimeout = 60000,
    exponentialBackoff = true,
  } = options;

  const element = (await waitForElement<HTMLElement>(
    "#movie_player",
    10000,
  )) as unknown as YouTubePlayer;

  if (!element) {
    throw new Error("Player element not found");
  }

  let check = checkPlayerReadiness(element);
  if (check.isReady) {
    return element;
  }

  return new Promise((resolve, reject) => {
    let attempt = 0;
    let activeElapsed = 0;
    let lastTick = Date.now();
    let currentTimeout = baseTimeout;
    let consecutiveBufferingChecks = 0;
    let lastLogTime = 0;
    const LOG_INTERVAL = 10000;

    const cleanup = () => {
      clearInterval(checkInterval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      try {
        element.removeEventListener("onStateChange", onStateChange);
        element.removeEventListener("onError", onPlayerError);
      } catch {}
    };

    const log = (message: string) => {
      const now = Date.now();
      if (now - lastLogTime > LOG_INTERVAL) {
        console.log(`[YTE] ${message}`);
        lastLogTime = now;
      }
    };

    const calculateDynamicTimeout = (): number => {
      if (!exponentialBackoff) return baseTimeout;

      if (consecutiveBufferingChecks > 5) {
        const extraTime = Math.min(consecutiveBufferingChecks * 2000, 30000);
        return Math.min(currentTimeout + extraTime, maxTimeout);
      }

      return Math.min(baseTimeout * Math.pow(2, attempt), maxTimeout);
    };

    const tryResolve = () => {
      check = checkPlayerReadiness(element);

      if (check.isReady) {
        if (activeElapsed > baseTimeout) {
          log(`Player ready after ${activeElapsed}ms (delayed by buffering)`);
        }
        cleanup();
        resolve(element);
        return;
      }

      if (check.isBuffering) {
        consecutiveBufferingChecks++;
        log(`Buffering... (${consecutiveBufferingChecks} checks)`);
      } else {
        consecutiveBufferingChecks = 0;
      }

      currentTimeout = calculateDynamicTimeout();
    };

    const onVisibilityChange = () => {
      const now = Date.now();
      if (document.hidden) {
        activeElapsed += now - lastTick;
      }
      lastTick = now;
    };

    const onStateChange = () => {
      if (exponentialBackoff && attempt > 0) {
        attempt = Math.max(0, attempt - 1);
      }
      tryResolve();
    };

    const onPlayerError = (event: { data: number }) => {
      cleanup();
      reject(new Error(`Player error: ${event.data}`));
    };

    element.addEventListener("onStateChange", onStateChange);
    element.addEventListener("onError", onPlayerError);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const checkInterval = setInterval(() => {
      const now = Date.now();

      if (!document.hidden) {
        activeElapsed += now - lastTick;
      }
      lastTick = now;

      if (activeElapsed > currentTimeout) {
        tryResolve();

        if (
          !check.isReady &&
          check.isBuffering &&
          currentTimeout < maxTimeout
        ) {
          attempt++;
          log(`Extending timeout to ${currentTimeout}ms`);
          return;
        }

        cleanup();
        reject(
          new Error(
            `Player timeout: ${activeElapsed}ms, buffering=${check.isBuffering}`,
          ),
        );
        return;
      }

      if (activeElapsed % 500 < 100) {
        tryResolve();
      }
    }, 100);
  });
};
