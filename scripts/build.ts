import { mkdir, rm, copyFile, readdir, stat } from "fs/promises";
import { join, extname, dirname } from "path";
import { build } from "esbuild";
import { $ } from "bun";

const DIST = "dist";
const SRC = "src";

// ===== Utility Functions =====
async function ensureDir(path: string) {
  await mkdir(path, { recursive: true });
}

async function copyRecursive(src: string, dest: string) {
  const info = await stat(src);

  if (info.isDirectory()) {
    await ensureDir(dest);
    const entries = await readdir(src);

    await Promise.all(
      entries.map((entry) =>
        copyRecursive(join(src, entry), join(dest, entry)),
      ),
    );
    return;
  }

  // Skip SCSS and TypeScript files
  const ext = extname(src);
  if ([".scss", ".ts"].includes(ext)) return;

  await ensureDir(dirname(dest));
  await copyFile(src, dest);
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

// ===== Build Configuration =====
const STATIC_ENTRIES = [
  { input: join(SRC, "manifest.json"), output: join(DIST, "manifest.json") },
  { input: join(SRC, "background"), output: join(DIST, "background") },
  { input: join(SRC, "public"), output: join(DIST, "public") },
] as const;

const ESBUILD_COMMON_CONFIG = {
  bundle: true,
  minify: true,
  sourcemap: false,
  target: "es2020",
} as const;

// ===== Build Steps =====
async function cleanDist() {
  console.log("🧹 Cleaning dist directory...");
  await rm(DIST, { recursive: true, force: true });
  await ensureDir(DIST);
}

async function copyStaticFiles() {
  console.log("\n📋 Copying static files...");

  for (const entry of STATIC_ENTRIES) {
    try {
      const info = await stat(entry.input);

      if (info.isDirectory()) {
        await copyRecursive(entry.input, entry.output);
        console.log(`  ✓ ${entry.input} → ${entry.output}`);
      } else {
        await ensureDir(dirname(entry.output));
        await copyFile(entry.input, entry.output);
        console.log(`  ✓ ${entry.input} → ${entry.output}`);
      }
    } catch (error) {
      console.warn(`  ⚠ WARNING: ${entry.input} not found`);
    }
  }
}

async function buildInjectedBridge(siteDir: string, outputDir: string) {
  const injectedBridgePath = join(siteDir, "bridge", "injected-bridge.ts");

  if (!(await pathExists(injectedBridgePath))) {
    return false;
  }

  await build({
    ...ESBUILD_COMMON_CONFIG,
    entryPoints: [injectedBridgePath],
    outfile: join(outputDir, "injected-bridge.js"),
    format: "iife",
  });

  console.log("  ✓ injected-bridge.js (ISOLATED world)");
  return true;
}

async function buildMainScript(siteDir: string, outputDir: string) {
  const mainPath = join(siteDir, "main.ts");

  if (!(await pathExists(mainPath))) {
    throw new Error(`main.ts not found in ${siteDir}`);
  }

  await build({
    ...ESBUILD_COMMON_CONFIG,
    entryPoints: [mainPath],
    outfile: join(outputDir, "index.js"),
    format: "esm",
  });

  console.log("  ✓ index.js (MAIN world)");
}

async function compileStyles(site: string, siteDir: string, outputDir: string) {
  const stylePath = join(siteDir, "style.scss");

  if (!(await pathExists(stylePath))) {
    return false;
  }

  try {
    await $`bunx sass \
      ${stylePath} \
      ${join(outputDir, "style.css")} \
      --load-path=${join(SRC, "content-scripts", site, "styles")} \
      --load-path=${join(SRC, "styles")} \
      --style=compressed \
      --no-source-map`;

    console.log("  ✓ style.css");
    return true;
  } catch (error) {
    console.warn("  ⚠ SCSS compilation failed:", error);
    return false;
  }
}

async function buildSite(site: string) {
  console.log(`\n📦 Building ${site}...`);

  const siteDir = join(SRC, "content-scripts", site);
  const outputDir = join(DIST, site);

  await ensureDir(outputDir);

  // Build in order: injected-bridge → main → styles
  try {
    await buildInjectedBridge(siteDir, outputDir);
  } catch (error) {
    console.warn(`  ⚠ Skipping injected-bridge: ${error}`);
  }

  try {
    await buildMainScript(siteDir, outputDir);
  } catch (error) {
    console.error(`  ✗ Failed to build main script: ${error}`);
    throw error;
  }

  try {
    await compileStyles(site, siteDir, outputDir);
  } catch (error) {
    console.warn(`  ⚠ Skipping styles: ${error}`);
  }
}

async function buildAllSites() {
  const contentScriptsDir = join(SRC, "content-scripts");

  if (!(await pathExists(contentScriptsDir))) {
    console.warn("⚠ No content-scripts directory found");
    return;
  }

  const sites = await readdir(contentScriptsDir);

  for (const site of sites) {
    const sitePath = join(contentScriptsDir, site);
    const info = await stat(sitePath);

    if (info.isDirectory()) {
      await buildSite(site);
    }
  }
}

async function createZipArchive() {
  console.log("\n📦 Creating ZIP archive...");

  try {
    await $`cd ${DIST} && zip -r -9 ../yt-enhancer.zip . -x "*.DS_Store"`;
    console.log("  ✓ yt-enhancer.zip created");
  } catch (error) {
    console.error("  ✗ Failed to create ZIP:", error);
    throw error;
  }
}

// ===== Main Build Process =====
async function main() {
  const startTime = performance.now();

  try {
    await cleanDist();
    await copyStaticFiles();
    await buildAllSites();
    await createZipArchive();

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Build completed in ${duration}s`);
  } catch (error) {
    console.error("\n❌ Build failed:", error);
    process.exit(1);
  }
}

// Run build
main();
