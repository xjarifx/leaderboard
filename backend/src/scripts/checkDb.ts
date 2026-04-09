import "dotenv/config";
import prisma from "../lib/prisma.js";

async function main() {
  const count = await prisma.image.count();
  console.log("Images in DB:", count);
  const participants = await prisma.participant.count();
  console.log("Participants:", participants);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());