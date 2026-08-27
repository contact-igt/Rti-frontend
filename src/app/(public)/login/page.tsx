import { Suspense } from "react";
import { LoginScreen } from "@/components/features/auth/login-screen";

export default function LoginPage() {
  return <Suspense fallback={<main id="main-content" className="account-page"><div className="container route-loading">Preparing secure sign-in…</div></main>}><LoginScreen /></Suspense>;
}
