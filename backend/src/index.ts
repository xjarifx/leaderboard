import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import sessionsRoutes from "./routes/sessions.js";
import sessionDetailsRoutes from "./routes/sessionDetails.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import imagesRoutes from "./routes/images.js";
import publicRoutes from "./routes/public.js";

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/sessions", sessionDetailsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/public", publicRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
