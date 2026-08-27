"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api/auth";
import { writeSession } from "@/lib/auth/session";
import { safeReturnPath } from "@/lib/auth/return-path";
import { useDemoSession } from "@/lib/auth/use-session";
import { toCitizenError } from "@/lib/filing/errors";

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useDemoSession();
  const next = safeReturnPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") router.replace(next);
  }, [next, router, session.status]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password) {
      setError("Enter the configured demo email and password.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const response = await login(email.trim(), password);
      writeSession(response.data.session);
      router.replace(next);
      router.refresh();
    } catch (cause) {
      setError(toCitizenError(cause).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main id="main-content" className="account-page">
      <div className="container login-layout">
        <section className="login-intro" aria-labelledby="login-title">
          <p className="eyebrow"><span /> Citizen account</p>
          <h1 id="login-title">Return to your RTI case file.</h1>
          <p>Sign in to view applications created through RTI Saathi, check their recorded progress, and review your private filing details.</p>
          <div className="privacy-points"><p><ShieldCheck aria-hidden="true" /><span><strong>Private by default</strong>Your applicant and payment details only appear after sign-in.</span></p><p><LockKeyhole aria-hidden="true" /><span><strong>Session-only access</strong>Your demo token stays in this browser tab and is never added to a URL.</span></p></div>
        </section>
        <form className="login-card" onSubmit={submit} noValidate>
          <div className="login-card__mark"><LockKeyhole aria-hidden="true" /></div>
          <h2>Log in</h2>
          <p className="login-card__support">Use the prototype citizen account configured by the RTI Saathi administrator.</p>
          <div className="field-group"><label htmlFor="account-email">Email address</label><input id="account-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          <div className="field-group"><label htmlFor="account-password">Password</label><input id="account-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
          {error ? <p className="account-error" role="alert">{error}</p> : null}
          <button className="button button--primary button--large" type="submit" disabled={pending || session.status === "authenticated"}>{pending ? "Signing in…" : <>Log in securely <ArrowRight aria-hidden="true" /></>}</button>
          <p className="demo-account-note"><strong>Prototype account</strong>This sign-in is for demonstration only. RTI Saathi does not yet provide public account registration or password recovery.</p>
        </form>
      </div>
    </main>
  );
}
