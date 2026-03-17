import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { POST as register } from "@/app/api/auth/register/route";
import { POST as createSession, GET as getSessions } from "@/app/api/sessions/route";
import { GET as getCurrent } from "@/app/api/sessions/[id]/current/route";
import { makeRequest } from "./helpers";
import { prisma } from "@/lib/prisma";

const STUDENT_ID = "TEST_SESSION_001";
let token: string;
let sessionId: number;

beforeAll(async () => {
  // Clean up existing test participant and their sessions
  const existing = await prisma.participant.findUnique({ where: { student_id: STUDENT_ID } });
  if (existing) {
    const sessions = await prisma.session.findMany({ where: { participant_id: existing.id }, select: { id: true } });
    const sIds = sessions.map((s) => s.id);
    if (sIds.length > 0) {
      await prisma.sessionQueue.deleteMany({ where: { session_id: { in: sIds } } });
      await prisma.session.deleteMany({ where: { id: { in: sIds } } });
    }
    await prisma.participant.delete({ where: { id: existing.id } });
  }

  // Ensure at least one test image exists
  await prisma.image.upsert({
    where: { id: -1 },
    update: {},
    create: { id: -1, celebrity_name: "TEST_Celebrity", image_url: "/images-webp/test.webp" },
  }).catch(async () => {
    // upsert by id not supported if id doesn't exist yet — just ensure one exists
    const count = await prisma.image.count({ where: { celebrity_name: "TEST_Celebrity" } });
    if (count === 0) {
      await prisma.image.create({ data: { celebrity_name: "TEST_Celebrity", image_url: "/images-webp/test.webp" } });
    }
  });

  // Register and get token
  const req = makeRequest("/api/auth/register", {
    method: "POST",
    body: { student_id: STUDENT_ID, name: "Session Tester", password: "password123" },
  });
  const res = await register(req);
  const data = await res.json();
  token = data.token;
});

describe("POST /api/sessions", () => {
  it("requires authentication", async () => {
    const req = makeRequest("/api/sessions", { method: "POST" });
    const res = await createSession(req);
    expect(res.status).toBe(401);
  });

  it("creates a new session with a queue", async () => {
    const req = makeRequest("/api/sessions", { method: "POST", token });
    const res = await createSession(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.session_id).toBeDefined();
    expect(data.total).toBeGreaterThan(0);
    sessionId = data.session_id;
  });

  it("rejects creating a second active session", async () => {
    const req = makeRequest("/api/sessions", { method: "POST", token });
    const res = await createSession(req);
    expect(res.status).toBe(409);
  });
});

describe("GET /api/sessions", () => {
  it("returns the participant sessions", async () => {
    const req = makeRequest("/api/sessions", { token });
    const res = await getSessions(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("id");
    expect(data[0]).toHaveProperty("is_completed");
  });
});

describe("GET /api/sessions/:id/current", () => {
  it("returns the current image for the session", async () => {
    const req = makeRequest(`/api/sessions/${sessionId}/current`, { token });
    const res = await getCurrent(req, { params: Promise.resolve({ id: String(sessionId) }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.image).toBeDefined();
    expect(data.image.id).toBeDefined();
    expect(data.image.celebrity_name).toBeDefined();
    expect(data.current_index).toBe(0);
  });

  it("rejects access to another participant's session", async () => {
    // Register a second user
    await prisma.participant.deleteMany({ where: { student_id: "TEST_OTHER_001" } });
    const regReq = makeRequest("/api/auth/register", {
      method: "POST",
      body: { student_id: "TEST_OTHER_001", name: "Other User", password: "password123" },
    });
    const regRes = await register(regReq);
    const { token: otherToken } = await regRes.json();

    const req = makeRequest(`/api/sessions/${sessionId}/current`, { token: otherToken });
    const res = await getCurrent(req, { params: Promise.resolve({ id: String(sessionId) }) });
    expect(res.status).toBe(404);
  });
});

afterAll(async () => {
  for (const sid of [STUDENT_ID, "TEST_OTHER_001"]) {
    const p = await prisma.participant.findUnique({ where: { student_id: sid } });
    if (!p) continue;
    const sessions = await prisma.session.findMany({ where: { participant_id: p.id }, select: { id: true } });
    const sIds = sessions.map((s) => s.id);
    if (sIds.length > 0) {
      await prisma.rating.deleteMany({ where: { session_id: { in: sIds } } });
      await prisma.sessionQueue.deleteMany({ where: { session_id: { in: sIds } } });
      await prisma.session.deleteMany({ where: { id: { in: sIds } } });
    }
    await prisma.participant.delete({ where: { id: p.id } });
  }
  await prisma.$disconnect();
});
