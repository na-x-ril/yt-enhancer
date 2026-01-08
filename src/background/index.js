import browser from "webextension-polyfill";

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.url.includes("youtubei/v1/updated_metadata")) {
      console.log("YT metadata request detected", details);
    }
  },
  { urls: ["*://www.youtube.com/youtubei/v1/*"] },
);
