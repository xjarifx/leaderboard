import "dotenv/config";
import prisma from "../lib/prisma.js";

async function main() {
  const sessions = await prisma.session.count();
  const ratings = await prisma.rating.count();
  console.log("Sessions:", sessions, "Ratings:", ratings);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());