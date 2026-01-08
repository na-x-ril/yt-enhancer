// src/content-scripts/youtube/bridge/bridge.ts
export const storageBridge = {
  get: (key: string): Promise<any> => {
    return new Promise((resolve) => {
      window.postMessage({ type: "YT_ENHANCER_GET", key }, "*");

      const handler = (event: MessageEvent) => {
        if (
          event.source === window &&
          event.data.type === "YT_ENHANCER_GET_RESPONSE" &&
          event.data.key === key
        ) {
          window.removeEventListener("message", handler);
          resolve(event.data.value);
        }
      };

      window.addEventListener("message", handler);
    });
  },

  set: (key: string, value: any): Promise<void> => {
    return new Promise((resolve) => {
      window.postMessage({ type: "YT_ENHANCER_SET", key, value }, "*");

      const handler = (event: MessageEvent) => {
        if (
          event.source === window &&
          event.data.type === "YT_ENHANCER_SET_RESPONSE" &&
          event.data.key === key
        ) {
          window.removeEventListener("message", handler);
          resolve();
        }
      };

      window.addEventListener("message", handler);
    });
  },
};
