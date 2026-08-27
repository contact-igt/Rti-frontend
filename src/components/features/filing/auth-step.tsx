import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";

export function AuthStep({ pending, onBack, onLogin }: { pending: boolean; onBack: () => void; onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) { setError("Enter the configured demo email and password."); return; }
    setError(""); onLogin(email.trim(), password);
  }
  return (
    <form className="filing-form auth-handoff" onSubmit={submit} noValidate>
      <div className="auth-handoff__icon"><LockKeyhole aria-hidden="true" /></div>
      <div className="step-heading"><p className="section-index">Save and continue</p><h1 id="filing-step-title" tabIndex={-1}>Sign in to save this application.</h1><p>Signing in lets RTI Saathi create this prototype application under your demo account and show it in My Applications.</p></div>
      <div className="demo-boundary"><strong>Demo sign-in only</strong><p>Use the demo credentials configured by the RTI Saathi administrator. Full account management is planned for a later phase.</p></div>
      <div className="auth-fields"><div className="field-group"><label htmlFor="login-email">Email</label><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" /></div><div className="field-group"><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></div></div>
      {error ? <p className="field-error" role="alert">{error}</p> : null}
      <p className="privacy-line"><LockKeyhole aria-hidden="true" /> Your password and session token are never shown in the filing review.</p>
      <div className="step-actions"><button className="button button--secondary button--large" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Back to review</button><button className="button button--primary button--large" type="submit" disabled={pending}>{pending ? "Signing in…" : <>Sign in and continue <ArrowRight aria-hidden="true" /></>}</button></div>
    </form>
  );
}
