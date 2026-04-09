import "dotenv/config";
import prisma from "../lib/prisma.js";

async function main() {
  const p = await prisma.participant.findMany({
    select: { student_id: true, name: true },
  });
  console.log("Participants:", p.length);
  p.forEach((x) => console.log(x.student_id, x.name));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());