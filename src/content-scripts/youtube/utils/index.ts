// src/content-scripts/youtube/utils/index.ts
import type { YouTubePlayer } from "../types";

// ===== Utility Functions =====
export const fetchData = async (url: string) => {
  const res = await fetch(url);
  return res.text();
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getVideoId = () =>
  new URLSearchParams(new URL(location.href).search).get("v");

export const waitForElement = async <T extends Element>(
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

// Method-method yang harus ready sebelum player bisa digunakan
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
];

const isPlayerReady = (player: YouTubePlayer): boolean => {
  try {
    const allMethodsExist = REQUIRED_METHODS.every(
      (method) => typeof (player as any)[method] === "function",
    );

    if (!allMethodsExist) return false;

    const state = player.getPlayerState();
    const duration = player.getDuration();

    return typeof state === "number" && typeof duration === "number";
  } catch {
    return false;
  }
};

export const waitForPlayer = async (): Promise<YouTubePlayer> => {
  const element = (await waitForElement<HTMLElement>(
    "#movie_player",
  )) as unknown as YouTubePlayer;

  if (!element) {
    throw new Error("Player element not found");
  }

  return new Promise((resolve, reject) => {
    const timeout = 10000;
    const startTime = Date.now();

    const checkReady = setInterval(() => {
      if (Date.now() - startTime > timeout) {
        clearInterval(checkReady);
        reject(new Error("Player ready timeout"));
        return;
      }

      if (isPlayerReady(element)) {
        clearInterval(checkReady);
        resolve(element);
      }
    }, 100);
  });
};
