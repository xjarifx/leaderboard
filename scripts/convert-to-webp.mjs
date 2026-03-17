import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "public/images";
const DEST = "public/images-webp";
const SUPPORTED = [".jpg", ".jpeg", ".png", ".gif", ".avif", ".webp", ".jfif", ".jpg_"];

async function convertDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destSubDir = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await convertDir(srcPath, destSubDir);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    // treat .jpg_ as .jpg
    const normalizedExt = ext === ".jpg_" ? ".jpg" : ext;

    if (!SUPPORTED.includes(normalizedExt) && ext !== ".jpg_") continue;

    const baseName = path.basename(entry.name, ext);
    const destPath = path.join(destDir, baseName + ".webp");

    try {
      await sharp(srcPath).webp({ quality: 85 }).toFile(destPath);
      console.log(`✓ ${srcPath} → ${destPath}`);
    } catch (err) {
      console.error(`✗ ${srcPath}: ${err.message}`);
    }
  }
}

convertDir(SRC, DEST).then(() => console.log("\nDone."));
