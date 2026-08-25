import type { ReactNode } from "react";
import { CitizenHeader } from "@/components/layout/citizen-header";

export default function CitizenLayout({ children }: { children: ReactNode }) { return <><CitizenHeader />{children}</>; }
