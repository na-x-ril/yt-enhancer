// src/content-scripts/youtube/features/index.ts
import type { Feature } from "@/content-scripts/youtube/types";
import { watchFeature } from "./watch";

export const FEATURES: Feature[] = [watchFeature];
