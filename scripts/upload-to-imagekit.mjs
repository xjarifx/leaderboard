import "dotenv/config";
import fs from "fs";
import path from "path";
import { ImageKit } from "@imagekit/nodejs";
import { toFile } from "@imagekit/nodejs/uploads";

const ik = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY_PROD,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY_PROD,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT_PROD,
});

const ROOT = "public/images-webp";

function collectImages(root) {
  const results = [];
  for (const studentFolder of fs.readdirSync(root)) {
    const studentPath = path.join(root, studentFolder);
    if (!fs.statSync(studentPath).isDirectory()) continue;
    for (const celebFolder of fs.readdirSync(studentPath)) {
      const celebPath = path.join(studentPath, celebFolder);
      if (!fs.statSync(celebPath).isDirectory()) continue;
      for (const file of fs.readdirSync(celebPath)) {
        if (!file.endsWith(".webp")) continue;
        results.push({
          studentName: studentFolder.replace(" Pics", ""),
          celebrityName: celebFolder,
          filePath: path.join(celebPath, file),
          fileName: file,
        });
      }
    }
  }
  return results;
}

function slugify(name) {
  return name.replace(/\s+/g, "_");
}

async function upload(image) {
  const folder = `/leaderboard/${slugify(image.studentName)}/${slugify(image.celebrityName)}`;
  const fileBuffer = fs.readFileSync(image.filePath);
  const fileObj = await toFile(fileBuffer, image.fileName, { type: "image/webp" });

  const result = await ik.files.upload({
    file: fileObj,
    fileName: image.fileName,
    folder,
    useUniqueFileName: false,
  });

  return result.url;
}

async function main() {
  const images = collectImages(ROOT);
  console.log(`Found ${images.length} images to upload.\n`);

  // Load existing records to skip already-uploaded images
  let existing = [];
  if (fs.existsSync("scripts/imagekit-records.json")) {
    existing = JSON.parse(fs.readFileSync("scripts/imagekit-records.json", "utf8"));
  }
  const existingUrls = new Set(existing.map((r) => r.image_url));

  const records = [...existing];

  for (const img of images) {
    const expectedUrl = `${process.env.IMAGEKIT_URL_ENDPOINT_PROD}/leaderboard/${slugify(img.studentName)}/${slugify(img.celebrityName)}/${img.fileName}`;
    if (existingUrls.has(expectedUrl)) {
      console.log(`⏭ skip ${img.celebrityName}/${img.fileName}`);
      continue;
    }
    try {
      const url = await upload(img);
      records.push({ celebrity_name: img.celebrityName, image_url: url });
      existingUrls.add(url);
      console.log(`✓ ${img.celebrityName}/${img.fileName} → ${url}`);
    } catch (err) {
      console.error(`✗ ${img.filePath}: ${err.message}`);
    }
  }

  fs.writeFileSync("scripts/imagekit-records.json", JSON.stringify(records, null, 2));
  console.log(`\nDone. ${records.length} records saved to scripts/imagekit-records.json`);
}

main();
