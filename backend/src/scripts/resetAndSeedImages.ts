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
  return fileName.replace(/_crop\.png$/, "").replace(/_/g, " ");
}

async function main() {
  console.log("Resetting database...");

  await prisma.rating.deleteMany();
  await prisma.sessionQueue.deleteMany();
  await prisma.session.deleteMany();
  await prisma.image.deleteMany();
  await prisma.participant.deleteMany();

  console.log("Reading images from directory...");

  const files = fs.readdirSync(imagesDir).filter((f) => f.endsWith(".png"));

  console.log(`Found ${files.length} images`);

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const celebrityName = extractCelebrityName(file);

    console.log(`Uploading ${file}...`);

    const url = await uploadImage(filePath, file);

    console.log(`Storing ${celebrityName} in database...`);

    await prisma.image.create({
      data: {
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