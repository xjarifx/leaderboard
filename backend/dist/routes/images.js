import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();
router.get("/", authenticate, async (_req, res) => {
    try {
        const images = await prisma.image.findMany({
            orderBy: { celebrity_name: "asc" },
        });
        res.json(images);
    }
    catch (error) {
        console.error("Get images error:", error);
        res.status(500).json({ error: "Failed to get images" });
    }
});
router.post("/", authenticate, async (req, res) => {
    try {
        const { celebrity_name, image_url } = req.body;
        if (!celebrity_name || !image_url) {
            return res.status(400).json({ error: "celebrity_name and image_url are required" });
        }
        const image = await prisma.image.create({
            data: { celebrity_name, image_url },
        });
        res.json(image);
    }
    catch (error) {
        console.error("Create image error:", error);
        res.status(500).json({ error: "Failed to create image" });
    }
});
export default router;
