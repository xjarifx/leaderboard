import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { POST as register } from "@/app/api/auth/register/route";
import { POST as login } from "@/app/api/auth/login/route";
import { makeRequest } from "./helpers";
import { prisma } from "@/lib/prisma";

const STUDENT_ID = "TEST_AUTH_001";

beforeAll(async () => {
  await prisma.participant.deleteMany({ where: { student_id: STUDENT_ID } });
});

afterAll(async () => {
  await prisma.participant.deleteMany({ where: { student_id: { in: [STUDENT_ID, "TEST_MISSING"] } } });
  await prisma.$disconnect();
});

describe("POST /api/auth/register", () => {
  it("registers a new participant and returns a token", async () => {
    const req = makeRequest("/api/auth/register", {
      method: "POST",
      body: { student_id: STUDENT_ID, name: "Test User", password: "password123" },
    });
    const res = await register(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.token).toBeDefined();
    expect(data.participant.student_id).toBe(STUDENT_ID);
  });

  it("rejects duplicate student_id", async () => {
    const req = makeRequest("/api/auth/register", {
      method: "POST",
      body: { student_id: STUDENT_ID, name: "Duplicate", password: "password123" },
    });
    const res = await register(req);
    expect(res.status).toBe(409);
  });

  it("rejects missing fields", async () => {
    const req = makeRequest("/api/auth/register", {
      method: "POST",
      body: { student_id: "TEST_MISSING" },
    });
    const res = await register(req);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with correct credentials and returns a token", async () => {
    const req = makeRequest("/api/auth/login", {
      method: "POST",
      body: { student_id: STUDENT_ID, password: "password123" },
    });
    const res = await login(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.token).toBeDefined();
    expect(data.participant.student_id).toBe(STUDENT_ID);
  });

  it("rejects wrong password", async () => {
    const req = makeRequest("/api/auth/login", {
      method: "POST",
      body: { student_id: STUDENT_ID, password: "wrongpassword" },
    });
    const res = await login(req);
    expect(res.status).toBe(401);
  });

  it("rejects non-existent student_id", async () => {
    const req = makeRequest("/api/auth/login", {
      method: "POST",
      body: { student_id: "TEST_GHOST", password: "password123" },
    });
    const res = await login(req);
    expect(res.status).toBe(401);
  });
});
