import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// GET /api/images — list all images
export async function GET(req: NextRequest) {
  const user = authenticate(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const images = await prisma.image.findMany({
    select: { id: true, celebrity_name: true, image_url: true },
  });
  return NextResponse.json(images);
}

// POST /api/images — add a new image (admin use)
export async function POST(req: NextRequest) {
  const user = authenticate(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { celebrity_name, image_url } = await req.json();
  if (!celebrity_name || !image_url)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const image = await prisma.image.create({ data: { celebrity_name, image_url } });
  return NextResponse.json(image, { status: 201 });
}
