import { Suspense } from "react";
import { TrackingScreen } from "@/components/features/tracking/tracking-screen";
export default function TrackPage() { return <Suspense fallback={<main id="main-content" className="tracking-page"><div className="container route-loading">Preparing status lookup…</div></main>}><TrackingScreen /></Suspense>; }
