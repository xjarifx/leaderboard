import { Router } from "express";
import prisma from "../lib/prisma.js";
const router = Router();
router.get("/:id/current", async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id);
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                session_queue: {
                    orderBy: { order_index: "asc" },
                    include: { image: true },
                },
                ratings: true,
            },
        });
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        if (session.participant_id !== req.participantId) {
            return res.status(403).json({ error: "Not authorized" });
        }
        if (session.is_completed) {
            return res.json({ completed: true, session });
        }
        const currentQueueItem = session.session_queue[session.current_index];
        if (!currentQueueItem) {
            await prisma.session.update({
                where: { id: sessionId },
                data: { is_completed: true },
            });
            return res.json({ completed: true, session });
        }
        res.json({
            completed: false,
            currentImage: currentQueueItem.image,
            progress: {
                current: session.current_index + 1,
                total: session.session_queue.length,
            },
            ratedCount: session.ratings.length,
        });
    }
    catch (error) {
        console.error("Get current image error:", error);
        res.status(500).json({ error: "Failed to get current image" });
    }
});
router.post("/:id/rate", async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id);
        const { rating, image_id } = req.body;
        if (!rating || rating < 1 || rating > 10) {
            return res.status(400).json({ error: "Rating must be between 1 and 10" });
        }
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                session_queue: {
                    orderBy: { order_index: "asc" },
                },
            },
        });
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        if (session.participant_id !== req.participantId) {
            return res.status(403).json({ error: "Not authorized" });
        }
        if (session.is_completed) {
            return res.status(400).json({ error: "Session already completed" });
        }
        const nextIndex = session.current_index + 1;
        const isCompleted = nextIndex >= session.session_queue.length;
        await prisma.$transaction([
            prisma.rating.create({
                data: {
                    session_id: sessionId,
                    image_id,
                    rating,
                },
            }),
            prisma.session.update({
                where: { id: sessionId },
                data: {
                    current_index: nextIndex,
                    is_completed: isCompleted,
                },
            }),
        ]);
        res.json({ success: true, completed: isCompleted });
    }
    catch (error) {
        console.error("Rate image error:", error);
        res.status(500).json({ error: "Failed to submit rating" });
    }
});
router.get("/:id/ratings", async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id);
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        if (session.participant_id !== req.participantId) {
            return res.status(403).json({ error: "Not authorized" });
        }
        const ratings = await prisma.rating.findMany({
            where: { session_id: sessionId },
            include: { image: true },
            orderBy: { id: "asc" },
        });
        res.json(ratings);
    }
    catch (error) {
        console.error("Get ratings error:", error);
        res.status(500).json({ error: "Failed to get ratings" });
    }
});
export default router;
