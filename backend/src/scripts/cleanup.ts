import "dotenv/config";
import prisma from "../lib/prisma.js";

async function main() {
  await prisma.rating.deleteMany({
    where: { session: { participant_id: 70 } }
  });
  await prisma.sessionQueue.deleteMany({
    where: { session: { participant_id: 70 } }
  });
  await prisma.session.deleteMany({
    where: { participant_id: 70 }
  });
  console.log("Cleaned up extra sessions for participant 70");
  
  const sessions = await prisma.session.count();
  const ratings = await prisma.rating.count();
  console.log(`Total: ${sessions} sessions, ${ratings} ratings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());