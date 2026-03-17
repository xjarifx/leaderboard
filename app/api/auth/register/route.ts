import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { student_id, name, password } = await req.json();

  if (!student_id || !name || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const existing = await prisma.participant.findUnique({ where: { student_id } });
  if (existing)
    return NextResponse.json({ error: "student_id already registered" }, { status: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const participant = await prisma.participant.create({
    data: { student_id, name, password: hashed },
  });

  const token = signToken({ participantId: participant.id, studentId: participant.student_id });
  return NextResponse.json({ token, participant: { id: participant.id, name: participant.name, student_id } }, { status: 201 });
}
