import "dotenv/config";
import fs from "fs";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const url = (process.env.DATABASE_URL ?? "").replace(/[?&]sslmode=[^&]*/g, "");
const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const records = JSON.parse(fs.readFileSync("scripts/imagekit-records.json", "utf8"));

async function main() {
  // Clear existing images (cascades via session_queue and ratings)
  await prisma.rating.deleteMany();
  await prisma.sessionQueue.deleteMany();
  await prisma.session.deleteMany();
  await prisma.image.deleteMany();

  const created = await prisma.image.createMany({ data: records });
  console.log(`Seeded ${created.count} images.`);
}

main().finally(() => prisma.$disconnect());
