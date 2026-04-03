import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.participantId = decoded.participantId;
        req.studentId = decoded.studentId;
        next();
    }
    catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
export function signToken(participantId, studentId) {
    return jwt.sign({ participantId, studentId }, JWT_SECRET, {
        expiresIn: "7d",
    });
}
