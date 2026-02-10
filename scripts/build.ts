import { $ } from "bun";
import { rmSync, existsSync, statSync, readdirSync, readFileSync } from "fs";
import path from "path";
import JSZip from "jszip";

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

const addFolderToZip = (zip: JSZip, folderPath: string) => {
  const files = readdirSync(folderPath, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(folderPath, file.name);

    if (file.isDirectory()) {
      const childZip = zip.folder(file.name);

      if (!childZip) {
        throw new Error(`Failed to create zip folder: ${file.name}`);
      }

      addFolderToZip(childZip, fullPath);
    } else {
      zip.file(file.name, readFileSync(fullPath));
    }
  }
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

    console.log("🗜️  Creating zip with JSZip...");

    const zip = new JSZip();
    addFolderToZip(zip, distPath);

    const content = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9,
      },
    });

    await Bun.write(zipPath, content);

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
