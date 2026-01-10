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

    // Handle REMOVE request
    if (event.data.type === "YT_ENHANCER_REMOVE") {
      await browser.storage.local.remove(event.data.key);
      window.postMessage(
        {
          type: "YT_ENHANCER_REMOVE_RESPONSE",
          key: event.data.key,
        },
        "*",
      );
    }

    // Handle CLEAR request
    if (event.data.type === "YT_ENHANCER_CLEAR") {
      await browser.storage.local.clear();
      window.postMessage(
        {
          type: "YT_ENHANCER_CLEAR_RESPONSE",
        },
        "*",
      );
    }

    // Handle GET_ALL request
    if (event.data.type === "YT_ENHANCER_GET_ALL") {
      const result = await browser.storage.local.get(null);
      window.postMessage(
        {
          type: "YT_ENHANCER_GET_ALL_RESPONSE",
          value: result,
        },
        "*",
      );
    }
  });
})();
