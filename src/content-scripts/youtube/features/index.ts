// src/content-scripts/youtube/features/index.ts
import type { Feature } from "@/content-scripts/youtube/types";
import { watchFeature } from "./watch";
import { livechatFeature } from "./livechat";

export const FEATURES: Feature[] = [watchFeature, livechatFeature];
