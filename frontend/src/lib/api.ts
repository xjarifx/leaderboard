const API_ORIGIN = (
  import.meta.env.VITE_API_URL as string | undefined
)?.replace(/\/$/, "");
const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

export interface Participant {
  id: number;
  student_id: string;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
}

export interface Image {
  id: number;
  image_index: string;
  celebrity_name: string;
  image_url: string;
}

export interface Session {
  id: number;
  participant_id: number;
  current_index: number;
  is_completed: boolean;
}

export interface Rating {
  id: number;
  session_id: number;
  image_id: number;
  rating: number;
  image: Image;
}

export interface LeaderboardEntry {
  celebrity_name: string;
  image_index: string;
  image_url: string;
  average_rating: number;
  rating_count: number;
}

export const api = {
  login: (student_id: string, password: string) =>
    request<{ token: string; participant: Participant }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ student_id, password }),
    }),

  register: (
    student_id: string,
    name: string,
    password: string,
    gender: "MALE" | "FEMALE" | "OTHER",
  ) =>
    request<{ token: string; participant: Participant }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ student_id, name, password, gender }),
    }),

  getSessions: () => request<Session[]>("/sessions"),

  createSession: () => request<Session>("/sessions", { method: "POST" }),

  getCurrentImage: (sessionId: number) =>
    request<{
      completed: boolean;
      currentImage?: Image;
      progress?: { current: number; total: number };
      ratedCount?: number;
    }>(`/sessions/${sessionId}/current`),

  rateImage: (sessionId: number, image_id: number, rating: number) =>
    request<{ success: boolean; completed: boolean }>(
      `/sessions/${sessionId}/rate`,
      {
        method: "POST",
        body: JSON.stringify({ image_id, rating }),
      },
    ),

  getSessionRatings: (sessionId: number) =>
    request<Rating[]>(`/sessions/${sessionId}/ratings`),

  getLeaderboard: () => request<LeaderboardEntry[]>("/leaderboard"),

  getImages: () => request<Image[]>("/images"),
};
