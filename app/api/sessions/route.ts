import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

/**
 * Shuffle images so no two consecutive images share the same celebrity.
 * Uses weighted random selection — at each step, picks randomly from all
 * eligible images (excluding the last celebrity shown), so the order is
 * genuinely different every time.
 */
function shuffleNoConsecutive(images: { id: number; celebrity_name: string }[]) {
  // Shuffle each celebrity's photos independently first
  const groups = new Map<string, typeof images>();
  for (const img of images) {
    const g = groups.get(img.celebrity_name) ?? [];
    g.push(img);
    groups.set(img.celebrity_name, g);
  }
  for (const g of groups.values()) {
    for (let i = g.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [g[i], g[j]] = [g[j], g[i]];
    }
  }

  // Build pool: flat array of remaining images per celebrity
  const pool = new Map(
    [...groups.entries()].map(([name, imgs]) => [name, [...imgs]])
  );

  const result: typeof images = [];
  let lastCeleb = "";

  while (pool.size > 0) {
    // Eligible celebrities: everyone except the last one shown
    const eligible = [...pool.keys()].filter((k) => k !== lastCeleb);

    // If no eligible (only one celebrity left and it matches last), fall back
    const candidates = eligible.length > 0 ? eligible : [...pool.keys()];

    // Pick a random celebrity from candidates (uniform)
    const celeb = candidates[Math.floor(Math.random() * candidates.length)];
    const group = pool.get(celeb)!;

    result.push(group.shift()!);
    lastCeleb = celeb;

    if (group.length === 0) pool.delete(celeb);
  }

  return result;
}

// POST /api/sessions — create a new session with a shuffled image queue
export async function POST(req: NextRequest) {
  const user = authenticate(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check for an existing incomplete session
  const existing = await prisma.session.findFirst({
    where: { participant_id: user.participantId, is_completed: false },
  });
  if (existing)
    return NextResponse.json({ error: "Active session already exists", session_id: existing.id }, { status: 409 });

  const images = await prisma.image.findMany();
  if (images.length === 0)
    return NextResponse.json({ error: "No images available" }, { status: 404 });

  const shuffled = shuffleNoConsecutive(images);

  const session = await prisma.session.create({
    data: {
      participant_id: user.participantId,
      session_queue: {
        create: shuffled.map((img, i) => ({
          image_id: img.id,
          order_index: i,
        })),
      },
    },
  });

  return NextResponse.json({ session_id: session.id, total: shuffled.length }, { status: 201 });
}

// GET /api/sessions — get all sessions for the authenticated participant
export async function GET(req: NextRequest) {
  const user = authenticate(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await prisma.session.findMany({
    where: { participant_id: user.participantId },
    select: { id: true, current_index: true, is_completed: true },
  });

  return NextResponse.json(sessions);
}
