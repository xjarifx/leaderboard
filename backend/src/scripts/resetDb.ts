import "dotenv/config";
import prisma from "../lib/prisma.js";

async function main() {
  console.log("Resetting database tables...");

  await prisma.rating.deleteMany();
  await prisma.sessionQueue.deleteMany();
  await prisma.session.deleteMany();
  await prisma.image.deleteMany();
  await prisma.participant.deleteMany();

  console.log("Database reset complete.");
}

main()
  .catch((error) => {
    console.error("Reset failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
