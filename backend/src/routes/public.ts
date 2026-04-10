import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

function timestampForFileName(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

router.get("/data-download", async (_req: Request, res: Response) => {
  try {
    const [images, ratings] = await Promise.all([
      prisma.image.findMany({
        orderBy: { id: "asc" },
      }),
      prisma.rating.findMany({
        orderBy: { id: "asc" },
        include: {
          image: true,
          session: {
            include: {
              participant: true,
            },
          },
        },
      }),
    ]);

    const payload = {
      exported_at: new Date().toISOString(),
      totals: {
        images: images.length,
        ratings: ratings.length,
      },
      images: images.map((image) => ({
        id: image.id,
        image_index: image.image_index,
        celebrity_name: image.celebrity_name,
        image_url: image.image_url,
      })),
      ratings: ratings.map((rating) => ({
        id: rating.id,
        rating: rating.rating,
        session_id: rating.session_id,
        image: {
          id: rating.image.id,
          image_index: rating.image.image_index,
          celebrity_name: rating.image.celebrity_name,
          image_url: rating.image.image_url,
        },
        participant: {
          id: rating.session.participant.id,
          student_id: rating.session.participant.student_id,
          name: rating.session.participant.name,
          gender: rating.session.participant.gender,
        },
      })),
    };

    const fileName = `leaderboard-data-${timestampForFileName()}.json`;

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=\"${fileName}\"`,
    );
    res.status(200).send(JSON.stringify(payload, null, 2));
  } catch (error) {
    console.error("Public data download error:", error);
    res.status(500).json({ error: "Failed to generate data download" });
  }
});

export default router;
