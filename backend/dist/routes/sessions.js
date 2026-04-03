import { Router } from "express";
import prisma from "../lib/prisma.js";
const router = Router();
router.get("/", async (req, res) => {
    try {
        const sessions = await prisma.session.findMany({
            where: { participant_id: req.participantId },
            include: {
                ratings: true,
                session_queue: {
                    orderBy: { order_index: "asc" },
                    include: { image: true },
                },
            },
        });
        res.json(sessions);
    }
    catch (error) {
        console.error("Get sessions error:", error);
        res.status(500).json({ error: "Failed to get sessions" });
    }
});
router.post("/", async (req, res) => {
    try {
        const images = await prisma.image.findMany();
        if (images.length === 0) {
            return res.status(400).json({ error: "No images available" });
        }
        const shuffledImages = shuffleNoConsecutive(images);
        const session = await prisma.session.create({
            data: {
                participant_id: req.participantId,
                session_queue: {
                    create: shuffledImages.map((img, idx) => ({
                        image_id: img.id,
                        order_index: idx,
                    })),
                },
            },
            include: {
                session_queue: {
                    orderBy: { order_index: "asc" },
                    include: { image: true },
                },
            },
        });
        res.json(session);
    }
    catch (error) {
        console.error("Create session error:", error);
        res.status(500).json({ error: "Failed to create session" });
    }
});
function shuffleNoConsecutive(images) {
    const grouped = {};
    for (const img of images) {
        if (!grouped[img.celebrity_name]) {
            grouped[img.celebrity_name] = [];
        }
        grouped[img.celebrity_name].push(img);
    }
    const result = [];
    let lastGroup = null;
    while (Object.values(grouped).some((g) => g.length > 0)) {
        const groups = Object.keys(grouped).filter((g) => grouped[g].length > 0 && g !== lastGroup);
        if (groups.length === 0)
            break;
        const chosenGroup = groups[Math.floor(Math.random() * groups.length)];
        const img = grouped[chosenGroup].shift();
        result.push(img);
        lastGroup = chosenGroup;
    }
    return result;
}
export default router;
