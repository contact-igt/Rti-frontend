import Link from "next/link";
import { routes } from "@/config/routes";

export default function NotFound() { return <main id="main-content" className="page-shell"><h1>Page not found</h1><Link href={routes.home}>Return home</Link></main>; }
