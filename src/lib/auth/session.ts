const SESSION_KEY = "rti-saathi:demo-session";
export const SESSION_CHANGED_EVENT = "rti-saathi:session-changed";

type StoredSession = { token: string; expiresAt: string };

export function readSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(SESSION_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as StoredSession;
    if (!parsed.token || !parsed.expiresAt || Date.parse(parsed.expiresAt) <= Date.now()) {
      clearSession();
      return null;
    }
    return parsed;
  } catch {
    clearSession();
    return null;
  }
}

export function writeSession(session: StoredSession): void {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
  }
}
