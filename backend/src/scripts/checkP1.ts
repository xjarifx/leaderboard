import "dotenv/config";
import prisma from "../lib/prisma.js";

async function main() {
  const p = await prisma.participant.findMany({
    where: { id: 1 },
  });
  console.log("Participant 1:", p);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());