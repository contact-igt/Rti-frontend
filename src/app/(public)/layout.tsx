import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";

export default function PublicLayout({ children }: { children: ReactNode }) { return <><SiteHeader />{children}</>; }
