// src/content-scripts/youtube/features/livechat/index.ts
export const livechatFeature = (() => {
  let isInitialized = false;
  let allChatButton: HTMLButtonElement | null = null;

  // ===== Utility Functions =====
  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const waitForElement = async <T extends Element>(
    selector: string,
    timeout: number = 5000,
  ): Promise<T | null> => {
    const element = document.querySelector(selector) as T;
    if (element) return element;

    return new Promise((resolve) => {
      const startTime = Date.now();
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector) as T;
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

  // ===== Main Functions =====
  const clickAllChatButton = async () => {
    try {
      allChatButton = await waitForElement<HTMLButtonElement>(
        "a.yt-simple-endpoint:nth-child(2)",
      );

      if (allChatButton) {
        console.log("All chat button found, clicking...");
        allChatButton.click();
        isInitialized = true;
      } else {
        console.warn("All chat button not found");
      }
    } catch (err) {
      console.error("Failed to click all chat button:", err);
    }
  };

  // ===== Module Interface =====
  return {
    match: (path: string) => {
      return path === "/live_chat" || path === "/live_chat_replay";
    },

    init: async () => {
      console.log("Livechat feature initialized");

      await delay(500);
      await clickAllChatButton();

      return () => {
        allChatButton = null;
        isInitialized = false;
        console.log("Livechat feature destroyed");
      };
    },
  };
})();
