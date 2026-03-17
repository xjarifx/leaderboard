import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { POST as register } from "@/app/api/auth/register/route";
import { POST as createSession } from "@/app/api/sessions/route";
import { GET as getCurrent } from "@/app/api/sessions/[id]/current/route";
import { POST as rateImage } from "@/app/api/sessions/[id]/rate/route";
import { GET as getRatings } from "@/app/api/sessions/[id]/ratings/route";
import { makeRequest } from "./helpers";
import { prisma } from "@/lib/prisma";

const STUDENT_ID = "TEST_RATING_001";
let token: string;
let sessionId: number;
let firstImageId: number;

beforeAll(async () => {
  // Clean up existing test participant and their sessions
  const existing = await prisma.participant.findUnique({ where: { student_id: STUDENT_ID } });
  if (existing) {
    const sessions = await prisma.session.findMany({ where: { participant_id: existing.id }, select: { id: true } });
    const sIds = sessions.map((s) => s.id);
    if (sIds.length > 0) {
      await prisma.rating.deleteMany({ where: { session_id: { in: sIds } } });
      await prisma.sessionQueue.deleteMany({ where: { session_id: { in: sIds } } });
      await prisma.session.deleteMany({ where: { id: { in: sIds } } });
    }
    await prisma.participant.delete({ where: { id: existing.id } });
  }

  // Ensure test images exist
  for (const name of ["TEST_Celebrity A", "TEST_Celebrity B"]) {
    const exists = await prisma.image.findFirst({ where: { celebrity_name: name } });
    if (!exists) await prisma.image.create({ data: { celebrity_name: name, image_url: `/images-webp/${name}.webp` } });
  }

  // Register
  const regRes = await register(
    makeRequest("/api/auth/register", {
      method: "POST",
      body: { student_id: STUDENT_ID, name: "Rating Tester", password: "password123" },
    })
  );
  token = (await regRes.json()).token;

  // Create session
  const sessRes = await createSession(makeRequest("/api/sessions", { method: "POST", token }));
  sessionId = (await sessRes.json()).session_id;

  // Get first image
  const currRes = await getCurrent(
    makeRequest(`/api/sessions/${sessionId}/current`, { token }),
    { params: Promise.resolve({ id: String(sessionId) }) }
  );
  firstImageId = (await currRes.json()).image.id;
});

describe("POST /api/sessions/:id/rate", () => {
  it("requires authentication", async () => {
    const req = makeRequest(`/api/sessions/${sessionId}/rate`, {
      method: "POST",
      body: { image_id: firstImageId, rating: 7 },
    });
    const res = await rateImage(req, { params: Promise.resolve({ id: String(sessionId) }) });
    expect(res.status).toBe(401);
  });

  it("rejects rating out of range", async () => {
    const req = makeRequest(`/api/sessions/${sessionId}/rate`, {
      method: "POST",
      token,
      body: { image_id: firstImageId, rating: 11 },
    });
    const res = await rateImage(req, { params: Promise.resolve({ id: String(sessionId) }) });
    expect(res.status).toBe(400);
  });

  it("rejects wrong image_id for current position", async () => {
    const req = makeRequest(`/api/sessions/${sessionId}/rate`, {
      method: "POST",
      token,
      body: { image_id: 99999, rating: 5 },
    });
    const res = await rateImage(req, { params: Promise.resolve({ id: String(sessionId) }) });
    expect(res.status).toBe(400);
  });

  it("submits a valid rating and advances the index", async () => {
    const req = makeRequest(`/api/sessions/${sessionId}/rate`, {
      method: "POST",
      token,
      body: { image_id: firstImageId, rating: 8 },
    });
    const res = await rateImage(req, { params: Promise.resolve({ id: String(sessionId) }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.rated).toBe(true);
  });

  it("rates all remaining images and completes the session", async () => {
    // Keep rating until session is complete
    let completed = false;
    let attempts = 0;

    while (!completed && attempts < 100) {
      attempts++;
      const currRes = await getCurrent(
        makeRequest(`/api/sessions/${sessionId}/current`, { token }),
        { params: Promise.resolve({ id: String(sessionId) }) }
      );
      const curr = await currRes.json();

      if (curr.completed) { completed = true; break; }

      const rateRes = await rateImage(
        makeRequest(`/api/sessions/${sessionId}/rate`, {
          method: "POST",
          token,
          body: { image_id: curr.image.id, rating: 5 },
        }),
        { params: Promise.resolve({ id: String(sessionId) }) }
      );
      const rateData = await rateRes.json();
      if (rateData.is_completed) completed = true;
    }

    expect(completed).toBe(true);
  });

  it("rejects rating on a completed session", async () => {
    const req = makeRequest(`/api/sessions/${sessionId}/rate`, {
      method: "POST",
      token,
      body: { image_id: firstImageId, rating: 5 },
    });
    const res = await rateImage(req, { params: Promise.resolve({ id: String(sessionId) }) });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/sessions/:id/ratings", () => {
  it("returns all submitted ratings for the session", async () => {
    const req = makeRequest(`/api/sessions/${sessionId}/ratings`, { token });
    const res = await getRatings(req, { params: Promise.resolve({ id: String(sessionId) }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("rating");
    expect(data[0]).toHaveProperty("image");
    expect(data[0].image).toHaveProperty("celebrity_name");
  });

  it("requires authentication", async () => {
    const req = makeRequest(`/api/sessions/${sessionId}/ratings`);
    const res = await getRatings(req, { params: Promise.resolve({ id: String(sessionId) }) });
    expect(res.status).toBe(401);
  });
});

afterAll(async () => {
  const p = await prisma.participant.findUnique({ where: { student_id: STUDENT_ID } });
  if (p) {
    const sessions = await prisma.session.findMany({ where: { participant_id: p.id }, select: { id: true } });
    const sIds = sessions.map((s) => s.id);
    if (sIds.length > 0) {
      await prisma.rating.deleteMany({ where: { session_id: { in: sIds } } });
      await prisma.sessionQueue.deleteMany({ where: { session_id: { in: sIds } } });
      await prisma.session.deleteMany({ where: { id: { in: sIds } } });
    }
    await prisma.participant.delete({ where: { id: p.id } });
  }
  await prisma.image.deleteMany({ where: { celebrity_name: { in: ["TEST_Celebrity A", "TEST_Celebrity B", "TEST_Celebrity"] } } });
  await prisma.$disconnect();
});
