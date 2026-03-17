import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// POST /api/sessions/:id/rate — submit a rating for the current image
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticate(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { image_id, rating } = await req.json();

  if (typeof rating !== "number" || rating < 1 || rating > 10)
    return NextResponse.json({ error: "Rating must be a number between 1 and 10" }, { status: 400 });

  const session = await prisma.session.findUnique({
    where: { id: Number(id) },
    include: {
      session_queue: { orderBy: { order_index: "asc" } },
    },
  });

  if (!session || session.participant_id !== user.participantId)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });

  if (session.is_completed)
    return NextResponse.json({ error: "Session already completed" }, { status: 400 });

  const current = session.session_queue[session.current_index];
  if (!current || current.image_id !== image_id)
    return NextResponse.json({ error: "image_id does not match current image" }, { status: 400 });

  const nextIndex = session.current_index + 1;
  const isCompleted = nextIndex >= session.session_queue.length;

  await prisma.$transaction(async (tx) => {
    await tx.rating.create({
      data: { session_id: session.id, image_id, rating },
    });
    await tx.session.update({
      where: { id: session.id },
      data: { current_index: nextIndex, is_completed: isCompleted },
    });
  });

  return NextResponse.json({
    rated: true,
    is_completed: isCompleted,
    next_index: isCompleted ? null : nextIndex,
  });
}
