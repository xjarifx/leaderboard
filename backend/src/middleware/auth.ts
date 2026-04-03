import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  participantId?: number;
  studentId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      participantId: number;
      studentId: string;
    };
    req.participantId = decoded.participantId;
    req.studentId = decoded.studentId;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function signToken(participantId: number, studentId: string): string {
  return jwt.sign({ participantId, studentId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}
