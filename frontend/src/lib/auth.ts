export interface Participant {
  id: number;
  student_id: string;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
}

export function getParticipant(): Participant | null {
  const data = localStorage.getItem("participant");
  return data ? JSON.parse(data) : null;
}

export function setParticipant(participant: Participant): void {
  localStorage.setItem("participant", JSON.stringify(participant));
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("participant");
  localStorage.removeItem("currentSession");
}

export function getCurrentSession(): number | null {
  const data = localStorage.getItem("currentSession");
  return data ? JSON.parse(data) : null;
}

export function setCurrentSession(sessionId: number): void {
  localStorage.setItem("currentSession", JSON.stringify(sessionId));
}
