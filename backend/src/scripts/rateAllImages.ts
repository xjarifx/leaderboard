import "dotenv/config";
import prisma from "../lib/prisma.js";
import { signToken } from "../middleware/auth.js";

function shuffleNoConsecutive(
  images: { id: number; celebrity_name: string }[]
) {
  const grouped: Record<string, typeof images> = {};
  for (const img of images) {
    if (!grouped[img.celebrity_name]) {
      grouped[img.celebrity_name] = [];
    }
    grouped[img.celebrity_name].push(img);
  }

  const result: typeof images = [];
  let lastGroup: string | null = null;

  while (Object.values(grouped).some((g) => g.length > 0)) {
    let groups = Object.keys(grouped).filter(
      (g) => grouped[g].length > 0 && g !== lastGroup
    );

    if (groups.length === 0) {
      groups = Object.keys(grouped).filter((g) => grouped[g].length > 0);
    }

    if (groups.length === 0) break;

    const chosenGroup = groups[Math.floor(Math.random() * groups.length)];
    const img = grouped[chosenGroup].shift()!;
    result.push(img);
    lastGroup = chosenGroup;
  }

  return result;
}

async function main() {
  const participants = await prisma.participant.findMany();
  const images = await prisma.image.findMany();

  console.log(`Processing ${participants.length} participants and ${images.length} images`);

  for (const participant of participants) {
    const token = signToken(participant.id, participant.student_id);
    
    const shuffledImages = shuffleNoConsecutive(images);
    
    const session = await prisma.session.create({
      data: {
        participant_id: participant.id,
        current_index: 50,
        is_completed: true,
        session_queue: {
          create: shuffledImages.map((img, idx) => ({
            image_id: img.id,
            order_index: idx,
          })),
        },
      },
    });

    for (const img of images) {
      const rating = Math.floor(Math.random() * 10) + 1;
      await prisma.rating.create({
        data: {
          session_id: session.id,
          image_id: img.id,
          rating: rating,
        },
      });
    }

    console.log(`✓ ${participant.name} - rated all ${images.length} images`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());