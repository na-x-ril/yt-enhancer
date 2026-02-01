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

const READY_STATES = new Set([1, 2]);

const isPlayerReady = (player: YouTubePlayer): boolean => {
  try {
    const allMethodsExist = REQUIRED_METHODS.every(
      (method) => typeof player[method] === "function",
    );
    if (!allMethodsExist) return false;

    const state = player.getPlayerState();
    const duration = player.getDuration();
    if (typeof state !== "number") return false;
    if (typeof duration !== "number" || duration <= 0) return false;

    return READY_STATES.has(state);
  } catch {
    return false;
  }
};

export const waitForPlayer = async (): Promise<YouTubePlayer> => {
  const element = (await waitForElement<HTMLElement>(
    "#movie_player",
    10000,
  )) as unknown as YouTubePlayer;

  if (!element) {
    throw new Error("Player element not found");
  }

  if (isPlayerReady(element)) {
    return element;
  }

  return new Promise((resolve, reject) => {
    const timeout = 10000;
    let activeElapsed = 0;
    let lastTick = Date.now();

    const cleanup = () => {
      clearInterval(checkInterval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      try {
        element.removeEventListener("onStateChange", onStateChange);
      } catch {}
    };

    const tryResolve = () => {
      if (isPlayerReady(element)) {
        cleanup();
        resolve(element);
      }
    };

    const onVisibilityChange = () => {
      lastTick = Date.now();
    };

    const onStateChange = () => {
      tryResolve();
    };

    element.addEventListener("onStateChange", onStateChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const checkInterval = setInterval(() => {
      const now = Date.now();
      if (!document.hidden) {
        activeElapsed += now - lastTick;
      }
      lastTick = now;

      if (activeElapsed > timeout) {
        cleanup();
        reject(new Error("Player ready timeout"));
        return;
      }

      tryResolve();
    }, 200);
  });
};
