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

  // Clear specific key
  remove: (key: string): Promise<void> => {
    return new Promise((resolve) => {
      window.postMessage({ type: "YT_ENHANCER_REMOVE", key }, "*");
      const handler = (event: MessageEvent) => {
        if (
          event.source === window &&
          event.data.type === "YT_ENHANCER_REMOVE_RESPONSE" &&
          event.data.key === key
        ) {
          window.removeEventListener("message", handler);
          resolve();
        }
      };
      window.addEventListener("message", handler);
    });
  },

  // Clear all storage
  clear: (): Promise<void> => {
    return new Promise((resolve) => {
      window.postMessage({ type: "YT_ENHANCER_CLEAR" }, "*");
      const handler = (event: MessageEvent) => {
        if (
          event.source === window &&
          event.data.type === "YT_ENHANCER_CLEAR_RESPONSE"
        ) {
          window.removeEventListener("message", handler);
          resolve();
        }
      };
      window.addEventListener("message", handler);
    });
  },

  // Clear by prefix
  clearByPrefix: async (prefix: string): Promise<void> => {
    const all = await storageBridge.getAll();
    const keysToRemove = Object.keys(all).filter((key) =>
      key.startsWith(prefix),
    );

    await Promise.all(keysToRemove.map((key) => storageBridge.remove(key)));
  },

  // Clear by pattern
  clearByPattern: async (pattern: RegExp): Promise<void> => {
    const all = await storageBridge.getAll();
    const keysToRemove = Object.keys(all).filter((key) => pattern.test(key));

    await Promise.all(keysToRemove.map((key) => storageBridge.remove(key)));
  },

  // Get all keys
  getAll: (): Promise<Record<string, any>> => {
    return new Promise((resolve) => {
      window.postMessage({ type: "YT_ENHANCER_GET_ALL" }, "*");
      const handler = (event: MessageEvent) => {
        if (
          event.source === window &&
          event.data.type === "YT_ENHANCER_GET_ALL_RESPONSE"
        ) {
          window.removeEventListener("message", handler);
          resolve(event.data.value);
        }
      };
      window.addEventListener("message", handler);
    });
  },
};

(window as any).__storage = storageBridge;
