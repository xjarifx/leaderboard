import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { AuthRequest, authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const leaderboard = await prisma.rating.groupBy({
      by: ["image_id"],
      _avg: { rating: true },
      _count: { rating: true },
      orderBy: { _avg: { rating: "desc" } },
    });

    const imageIds = leaderboard.map((entry) => entry.image_id);

    const images = await prisma.image.findMany({
      where: { id: { in: imageIds } },
    });

    const imageMap = new Map(images.map((img) => [img.id, img]));

    const result = leaderboard.map((entry) => {
      const image = imageMap.get(entry.image_id)!;
      return {
        image_id: entry.image_id,
        celebrity_name: image.celebrity_name,
        image_url: image.image_url,
        average_rating: entry._avg.rating,
        rating_count: entry._count.rating,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ error: "Failed to get leaderboard" });
  }
});

export default router;
