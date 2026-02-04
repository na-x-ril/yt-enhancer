// src/content-scripts/youtube/controller/index.ts
import type { Feature } from "../types/feature";
import { getVideoId } from "../utils";

let activeFeature: {
  destroy?: () => void;
  feature: Feature;
  videoId?: string | null;
} | null = null;

export async function syncFeatures(features: Feature[]) {
  const path = location.pathname;
  const currentVideoId = getVideoId();
  const nextFeature = features.find((f) => f.match(path)) || null;

  const isSameVideo =
    activeFeature?.feature === nextFeature &&
    activeFeature?.videoId === currentVideoId;

  if (isSameVideo) return;

  if (activeFeature?.destroy) activeFeature.destroy();

  if (!nextFeature) {
    activeFeature = null;
    return;
  }

  const cleanupOrPromise = nextFeature.init?.();
  let cleanup: (() => void) | undefined;

  if (cleanupOrPromise instanceof Promise) {
    cleanup = await cleanupOrPromise;
  } else {
    cleanup = cleanupOrPromise as (() => void) | undefined;
  }

  activeFeature = {
    destroy: cleanup,
    feature: nextFeature,
    videoId: currentVideoId,
  };
}
