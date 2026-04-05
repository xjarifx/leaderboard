import { Router, Response } from "express";
import prisma from "../lib/prisma.js";
import { AuthRequest, authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const ratings = await prisma.rating.findMany({
      include: {
        image: true,
      },
    });

    const personStats = new Map<string, { totalRating: number; count: number; imageUrls: string[] }>();

    for (const rating of ratings) {
      const name = rating.image.celebrity_name;
      const existing = personStats.get(name) || { totalRating: 0, count: 0, imageUrls: [] };
      existing.totalRating += rating.rating;
      existing.count += 1;
      if (!existing.imageUrls.includes(rating.image.image_url)) {
        existing.imageUrls.push(rating.image.image_url);
      }
      personStats.set(name, existing);
    }

    const result = Array.from(personStats.entries()).map(([celebrity_name, stats]) => ({
      celebrity_name,
      image_url: stats.imageUrls[0],
      average_rating: stats.count > 0 ? stats.totalRating / stats.count : 0,
      rating_count: stats.count,
    }));

    result.sort((a, b) => b.average_rating - a.average_rating);

    res.json(result);
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ error: "Failed to get leaderboard" });
  }
});

export default router;
