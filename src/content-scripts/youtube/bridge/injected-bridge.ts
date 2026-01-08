// src/content-scripts/youtube/bridge/injected-bridge.ts
import browser from "webextension-polyfill";

(() => {
  window.addEventListener("message", async (event) => {
    if (event.source !== window) return;

    // Handle GET request
    if (event.data.type === "YT_ENHANCER_GET") {
      const result = await browser.storage.local.get(event.data.key);
      window.postMessage(
        {
          type: "YT_ENHANCER_GET_RESPONSE",
          key: event.data.key,
          value: result[event.data.key],
        },
        "*",
      );
    }

    // Handle SET request
    if (event.data.type === "YT_ENHANCER_SET") {
      await browser.storage.local.set({
        [event.data.key]: event.data.value,
      });
      window.postMessage(
        {
          type: "YT_ENHANCER_SET_RESPONSE",
          key: event.data.key,
        },
        "*",
      );
    }
  });
})();
