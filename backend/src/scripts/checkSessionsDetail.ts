import "dotenv/config";
import prisma from "../lib/prisma.js";

async function main() {
  const sessions = await prisma.session.findMany({
    select: { 
      id: true, 
      participant_id: true, 
      ratings: { select: { id: true } },
      is_completed: true,
    },
    orderBy: { id: "asc" },
  });
  console.log("Sessions:", sessions.length);
  sessions.forEach(s => console.log(`Session ${s.id} - Participant ${s.participant_id} - Ratings: ${s.ratings.length} - Completed: ${s.is_completed}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());