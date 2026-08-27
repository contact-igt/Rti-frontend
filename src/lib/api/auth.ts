import { apiRequest } from "@/lib/api/client";
import type { DemoUser } from "@/types/filing";

export type LoginResult = {
  user: DemoUser;
  session: { token: string; expiresAt: string };
};

export function login(email: string, password: string) {
  return apiRequest<{ data: LoginResult; meta: { demo: true } }>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function getSession(token: string) {
  return apiRequest<{ data: { authenticated: true; user: DemoUser; expiresAt: string }; meta: { demo: true } }>("/api/auth/session", { token });
}

export function logout(token: string) {
  return apiRequest<{ data: { loggedOut: true }; meta: { demo: true } }>("/api/auth/logout", { method: "POST", token });
}
