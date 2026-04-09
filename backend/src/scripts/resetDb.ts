import "dotenv/config";
import prisma from "../lib/prisma.js";

async function main() {
  console.log("Resetting voting data and accounts (keeping images)...");

  await prisma.rating.deleteMany();
  await prisma.sessionQueue.deleteMany();
  await prisma.session.deleteMany();
  await prisma.participant.deleteMany();

  console.log("Voting data and accounts reset complete. Images preserved.");
}

main()
  .catch((error) => {
    console.error("Reset failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
