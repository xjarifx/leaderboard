import "dotenv/config";
import fs from "fs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const url = (process.env.DATABASE_URL ?? "").replace(/[?&]sslmode=[^&]*/g, "");
const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

const all: { celebrity_name: string; image_url: string }[] = JSON.parse(
  fs.readFileSync("scripts/imagekit-records.json", "utf8")
);

// Keep only the first 5 images per celebrity
const seen = new Map<string, number>();
const records = all.filter((r) => {
  const count = seen.get(r.celebrity_name) ?? 0;
  if (count >= 5) return false;
  seen.set(r.celebrity_name, count + 1);
  return true;
});

async function main() {
  await prisma.rating.deleteMany();
  await prisma.sessionQueue.deleteMany();
  await prisma.session.deleteMany();
  await prisma.image.deleteMany();

  const created = await prisma.image.createMany({ data: records });
  console.log(`Seeded ${created.count} images (5 per celebrity, ${seen.size} celebrities).`);
}

main().finally(() => prisma.$disconnect());
