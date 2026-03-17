import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// GET /api/sessions/:id/ratings — get all ratings for a session
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticate(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const session = await prisma.session.findUnique({ where: { id: Number(id) } });

  if (!session || session.participant_id !== user.participantId)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const ratings = await prisma.rating.findMany({
    where: { session_id: session.id },
    include: { image: { select: { id: true, celebrity_name: true, image_url: true } } },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(ratings);
}
