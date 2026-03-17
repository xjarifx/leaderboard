import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { student_id, password } = await req.json();

  if (!student_id || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const participant = await prisma.participant.findUnique({ where: { student_id } });
  if (!participant)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, participant.password);
  if (!valid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken({ participantId: participant.id, studentId: participant.student_id });
  return NextResponse.json({ token, participant: { id: participant.id, name: participant.name, student_id } });
}
