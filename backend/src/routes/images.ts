import { Router, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { AuthRequest, authenticate } from "../middleware/auth.js";

const router = Router();

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ23456789";

async function generateUniqueIndex(prismaClient: typeof prisma): Promise<string> {
  let index: string;
  let exists = true;
  do {
    index = "";
    for (let i = 0; i < 4; i++) {
      index += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    const existing = await prismaClient.image.findUnique({ where: { image_index: index } });
    exists = !!existing;
  } while (exists);
  return index;
}

router.get("/", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const images = await prisma.image.findMany({
      orderBy: { celebrity_name: "asc" },
    });
    res.json(images);
  } catch (error) {
    console.error("Get images error:", error);
    res.status(500).json({ error: "Failed to get images" });
  }
});

router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { celebrity_name, image_url } = req.body;

    if (!celebrity_name || !image_url) {
      return res.status(400).json({ error: "celebrity_name and image_url are required" });
    }

    const imageIndex = await generateUniqueIndex(prisma);

    const image = await prisma.image.create({
      data: { image_index: imageIndex, celebrity_name, image_url },
    });

    res.json(image);
  } catch (error) {
    console.error("Create image error:", error);
    res.status(500).json({ error: "Failed to create image" });
  }
});

export default router;
