"use client";

import { useCallback, useEffect, useState } from "react";
import { getSession, logout as logoutRequest } from "@/lib/api/auth";
import { clearSession, readSession, SESSION_CHANGED_EVENT } from "@/lib/auth/session";
import type { DemoUser } from "@/types/filing";
import { ApiError } from "@/lib/api/client";

type SessionView =
  | { status: "loading"; token: null; user: null }
  | { status: "anonymous"; token: null; user: null }
  | { status: "error"; token: null; user: null }
  | { status: "authenticated"; token: string; user: DemoUser };

export function useDemoSession() {
  const [view, setView] = useState<SessionView>({ status: "loading", token: null, user: null });

  const refresh = useCallback(async () => {
    const stored = readSession();
    if (!stored) {
      setView({ status: "anonymous", token: null, user: null });
      return;
    }
    try {
      const response = await getSession(stored.token);
      setView({ status: "authenticated", token: stored.token, user: response.data.user });
    } catch (cause) {
      if (cause instanceof ApiError && (cause.status === 401 || cause.code === "SESSION_EXPIRED" || cause.code === "AUTHENTICATION_REQUIRED")) {
        clearSession();
        setView({ status: "anonymous", token: null, user: null });
      } else {
        setView({ status: "error", token: null, user: null });
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    const onChange = () => void refresh();
    window.addEventListener(SESSION_CHANGED_EVENT, onChange);
    return () => { window.clearTimeout(timer); window.removeEventListener(SESSION_CHANGED_EVENT, onChange); };
  }, [refresh]);

  const logout = useCallback(async () => {
    const stored = readSession();
    try {
      if (stored) await logoutRequest(stored.token);
    } finally {
      clearSession();
      setView({ status: "anonymous", token: null, user: null });
    }
  }, []);

  return { ...view, logout, refresh };
}
