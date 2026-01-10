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

export const waitForPlayer = async (): Promise<YouTubePlayer> => {
  const element = (await waitForElement<HTMLElement>(
    "#movie_player",
  )) as unknown as YouTubePlayer;

  if (!element) {
    throw new Error("Player element not found");
  }

  return new Promise((resolve) => {
    const checkReady = setInterval(() => {
      if (typeof element!.getPlayerState === "function") {
        clearInterval(checkReady);
        resolve(element!);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkReady);
      resolve(element!);
    }, 3000);
  });
};
