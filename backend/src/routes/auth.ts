import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { student_id, name, password } = req.body;

    if (!student_id || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await prisma.participant.findUnique({
      where: { student_id },
    });

    if (existing) {
      return res.status(400).json({ error: "Student ID already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const participant = await prisma.participant.create({
      data: {
        student_id,
        name,
        password: hashedPassword,
      },
    });

    const token = signToken(participant.id, participant.student_id);

    res.json({
      token,
      participant: {
        id: participant.id,
        student_id: participant.student_id,
        name: participant.name,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { student_id, password } = req.body;

    if (!student_id || !password) {
      return res.status(400).json({ error: "Student ID and password required" });
    }

    const participant = await prisma.participant.findUnique({
      where: { student_id },
    });

    if (!participant) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, participant.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(participant.id, participant.student_id);

    res.json({
      token,
      participant: {
        id: participant.id,
        student_id: participant.student_id,
        name: participant.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
