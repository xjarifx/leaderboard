import "dotenv/config";
import prisma from "../lib/prisma.js";

async function main() {
  const p = await prisma.participant.findMany({
    select: { id: true, student_id: true, name: true },
    orderBy: { id: "asc" },
  });
  console.log("All participants:");
  p.forEach((x) => console.log(x.id, x.student_id, x.name));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());