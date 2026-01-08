// src/content-scripts/youtube/main.ts
import { FEATURES } from "./features";
import { syncFeatures } from "./controller";
import { Dropdown } from "./components/dropdown";

let dropdown: Dropdown | null = null;

const initDropdown = async () => {
  if (!dropdown) {
    dropdown = new Dropdown();
    await dropdown.init();
  }

  const waitForTarget = setInterval(() => {
    const target = document.querySelector("#end");
    if (target) {
      clearInterval(waitForTarget);
      dropdown!.inject();
    }
  }, 100);
};

syncFeatures(FEATURES);
initDropdown();

let lastPath = location.pathname;
let lastVideoId = new URLSearchParams(location.search).get("v");

const observer = new MutationObserver(() => {
  const currentPath = location.pathname;
  const currentVideoId = new URLSearchParams(location.search).get("v");

  if (currentPath !== lastPath || currentVideoId !== lastVideoId) {
    lastPath = currentPath;
    lastVideoId = currentVideoId;
    syncFeatures(FEATURES);
  }

  // Re-inject dropdown jika hilang
  if (!document.querySelector("#yt-enhancer-dropdown")) {
    dropdown?.inject();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
