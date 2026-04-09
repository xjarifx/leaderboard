import "dotenv/config";
import fs from "fs";
import path from "path";
import ImageKit from "imagekit";
import prisma from "../lib/prisma.js";

const imagesDir = "/home/x/Documents/leaderboard/images";

const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } =
  process.env;

if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
  throw new Error("Missing ImageKit credentials");
}

const imageKit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

async function deleteImageKitFolder() {
  console.log("Deleting existing images from ImageKit...");

  const foldersToCheck = ["/leaderboard", "/"];

  for (const folder of foldersToCheck) {
    console.log(`Checking folder: ${folder}`);
    let hasMore = true;
    let skip = 0;
    const limit = 100;

    while (hasMore) {
      try {
        const result = await imageKit.listFiles({
          folder: folder,
          limit: limit,
          skip: skip,
        });

        if (result.length === 0) {
          hasMore = false;
        } else {
          for (const file of result) {
            await imageKit.deleteFile(file.fileId);
            console.log(`Deleted: ${file.name}`);
          }
          skip += limit;
          if (result.length < limit) {
            hasMore = false;
          }
        }
      } catch (error) {
        console.log(`Error listing files in ${folder}:`, error);
        hasMore = false;
      }
    }
  }

  console.log("ImageKit cleared.");
}

async function uploadImage(filePath: string, fileName: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString("base64");

  const response = await imageKit.upload({
    file: base64,
    fileName: fileName,
    folder: "/leaderboard",
  });

  return response.url;
}

function extractCelebrityName(fileName: string): string {
  return fileName.replace(/\.png$/, "");
}

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGGHJKLMNPQRSTUVWXYZ23456789";

function generateUniqueIndex(usedIndices: Set<string>): string {
  let index: string;
  do {
    index = "";
    for (let i = 0; i < 4; i++) {
      index += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
  } while (usedIndices.has(index));
  usedIndices.add(index);
  return index;
}

async function main() {
  console.log("Deleting existing images from ImageKit...");
  await deleteImageKitFolder();

  console.log("Resetting database...");

  await prisma.rating.deleteMany();
  await prisma.sessionQueue.deleteMany();
  await prisma.session.deleteMany();
  await prisma.image.deleteMany();
  await prisma.participant.deleteMany();

  console.log("Reading images from directory...");

  const files = fs.readdirSync(imagesDir).filter((f) => f.endsWith(".png"));

  console.log(`Found ${files.length} images`);

  const usedIndices = new Set<string>();

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const celebrityName = extractCelebrityName(file);
    const imageIndex = generateUniqueIndex(usedIndices);

    console.log(`Uploading ${file}...`);

    const url = await uploadImage(filePath, file);

    console.log(`Storing ${celebrityName} (${imageIndex}) in database...`);

    await prisma.image.create({
      data: {
        image_index: imageIndex,
        celebrity_name: celebrityName,
        image_url: url,
      },
    });
  }

  const count = await prisma.image.count();
  console.log(`Done! Seeded ${count} images.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });