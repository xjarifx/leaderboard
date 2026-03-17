import { NextRequest } from "next/server";

export function makeRequest(
  url: string,
  options: { method?: string; body?: unknown; token?: string } = {}
) {
  const { method = "GET", body, token } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return new NextRequest(`http://localhost${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}
