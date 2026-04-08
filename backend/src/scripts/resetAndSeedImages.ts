import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import ImageKit from "imagekit";
import prisma from "../lib/prisma.js";

function parseCelebrityName(fileName: string): string {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const match = baseName.match(/^(.*)_\d+_crop$/);
  const rawName = match ? match[1] : baseName;
  return rawName.replace(/_/g, " ").trim();
}

async function getImageFiles(imagesDir: string): Promise<string[]> {
  const entries = await fs.readdir(imagesDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b));
}

async function main() {
  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } =
    process.env;

  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    throw new Error("Missing ImageKit credentials in environment variables");
  }

  const imageKit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  });

  const imagesDir = path.resolve(process.cwd(), "../images");
  const imageFiles = await getImageFiles(imagesDir);

  if (imageFiles.length === 0) {
    throw new Error(`No image files found in ${imagesDir}`);
  }

  console.log(`Found ${imageFiles.length} image files`);
  console.log("Resetting app data tables...");

  // Clear child tables first to satisfy FK constraints.
  await prisma.rating.deleteMany();
  await prisma.sessionQueue.deleteMany();
  await prisma.session.deleteMany();
  await prisma.image.deleteMany();
  await prisma.participant.deleteMany();

  console.log("Uploading images and inserting DB rows...");

  let uploaded = 0;

  for (const fileName of imageFiles) {
    const absolutePath = path.join(imagesDir, fileName);
    const fileBuffer = await fs.readFile(absolutePath);
    const celebrityName = parseCelebrityName(fileName);

    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
      fileName,
      folder: "/leaderboard",
      useUniqueFileName: false,
      overwriteFile: true,
      overwriteAITags: true,
      overwriteTags: true,
      overwriteCustomMetadata: true,
    });

    await prisma.image.create({
      data: {
        celebrity_name: celebrityName,
        image_url: uploadResponse.url,
      },
    });

    uploaded += 1;
    console.log(`Uploaded ${uploaded}/${imageFiles.length}: ${fileName}`);
  }

  console.log(`Done. Uploaded and inserted ${uploaded} images.`);
}

main()
  .catch((error) => {
    console.error("resetAndSeedImages failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
