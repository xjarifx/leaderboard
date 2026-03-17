import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// GET /api/sessions/:id/current — get the current image to rate
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticate(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id: Number(id) },
    include: {
      session_queue: {
        orderBy: { order_index: "asc" },
        include: { image: true },
      },
    },
  });

  if (!session || session.participant_id !== user.participantId)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });

  if (session.is_completed)
    return NextResponse.json({ completed: true, message: "Session already completed" });

  const current = session.session_queue[session.current_index];
  if (!current)
    return NextResponse.json({ error: "No more images" }, { status: 404 });

  return NextResponse.json({
    session_id: session.id,
    current_index: session.current_index,
    total: session.session_queue.length,
    image: {
      id: current.image.id,
      celebrity_name: current.image.celebrity_name,
      image_url: current.image.image_url,
    },
  });
}
