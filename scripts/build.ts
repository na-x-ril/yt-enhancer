// scripts/build.ts
import { $ } from "bun";
import { rmSync, existsSync, statSync } from "fs";
import path from "path";

const distPath = path.resolve("dist");
const zipPath = path.resolve("yt-enhancer.zip");

const formatSize = (bytes: number) => {
  const kb = bytes / 1024;
  const mb = kb / 1024;

  return {
    bytes,
    kb: kb.toFixed(2),
    mb: mb.toFixed(2),
  };
};

async function build() {
  try {
    console.log("🧹 Cleaning dist directory...");
    if (existsSync(distPath)) {
      rmSync(distPath, { recursive: true, force: true });
    }
    if (existsSync(zipPath)) {
      rmSync(zipPath);
    }

    console.log("📦 Building...");
    await $`rollup -c`;

    console.log("🗜️  Creating zip...");
    await $`cd dist && zip -r ../yt-enhancer.zip .`;

    if (existsSync(zipPath)) {
      const { size } = statSync(zipPath);
      const formatted = formatSize(size);

      console.log("📏 Bundle size:");
      console.log(`   ${formatted.kb} KB`);
      console.log(`   ${formatted.mb} MB`);
    }

    console.log("✅ Build complete!");
  } catch (err) {
    console.error("❌ Build failed:", err);
    process.exit(1);
  }
}

build();
