import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/leaderboard — average rating per celebrity, sorted descending
export async function GET() {
  const images = await prisma.image.findMany({
    include: { ratings: { select: { rating: true } } },
  });

  // Aggregate by celebrity
  const map = new Map<string, { total: number; count: number; sample_url: string }>();
  for (const img of images) {
    const entry = map.get(img.celebrity_name) ?? {
      total: 0,
      count: 0,
      sample_url: img.image_url,
    };
    for (const r of img.ratings) {
      entry.total += r.rating;
      entry.count += 1;
    }
    map.set(img.celebrity_name, entry);
  }

  const leaderboard = [...map.entries()]
    .map(([celebrity_name, { total, count, sample_url }]) => ({
      celebrity_name,
      avg_rating: count > 0 ? Math.round((total / count) * 10) / 10 : null,
      total_ratings: count,
      sample_url,
    }))
    .sort((a, b) => {
      // Unrated go to bottom
      if (a.avg_rating === null) return 1;
      if (b.avg_rating === null) return -1;
      return b.avg_rating - a.avg_rating;
    });

  return NextResponse.json(leaderboard);
}
