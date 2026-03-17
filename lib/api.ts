const BASE = "/api";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path: string, options: RequestInit = {}) {
  const { headers: optHeaders, ...rest } = options;
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(optHeaders as Record<string, string> | undefined),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export const api = {
  register: (body: { student_id: string; name: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { student_id: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  createSession: () =>
    request("/sessions", { method: "POST" }),

  getSessions: () =>
    request("/sessions"),

  getCurrentImage: (sessionId: number) =>
    request(`/sessions/${sessionId}/current`),

  rateImage: (sessionId: number, body: { image_id: number; rating: number }) =>
    request(`/sessions/${sessionId}/rate`, { method: "POST", body: JSON.stringify(body) }),

  getRatings: (sessionId: number) =>
    request(`/sessions/${sessionId}/ratings`),

  getLeaderboard: () =>
    request("/leaderboard"),
};
