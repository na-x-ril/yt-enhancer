// src/content-scripts/youtube/controller/index.ts

import type { Feature } from "../types/feature";

let activeFeature: { destroy?: () => void; feature: Feature } | null = null;

export async function syncFeatures(features: Feature[]) {
  const path = location.pathname;
  const nextFeature = features.find((f) => f.match(path)) || null;

  // destroy feature lama
  if (activeFeature?.destroy) activeFeature.destroy();

  if (!nextFeature) {
    activeFeature = null;
    return;
  }

  // jalankan init → bisa async
  const cleanupOrPromise = nextFeature.init?.();
  let cleanup: (() => void) | undefined;

  if (cleanupOrPromise instanceof Promise) {
    cleanup = await cleanupOrPromise;
  } else {
    cleanup = cleanupOrPromise as (() => void) | undefined;
  }

  activeFeature = { destroy: cleanup, feature: nextFeature };
}
