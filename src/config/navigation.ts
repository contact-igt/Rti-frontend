import type { RoutePath } from "@/config/routes";
import { routes } from "@/config/routes";

export type NavigationItem = { label: string; href: RoutePath };

export const publicNavigation: readonly NavigationItem[] = [
  { label: "Home", href: routes.home },
  { label: "Understand RTI", href: routes.learn },
  { label: "Track RTI", href: routes.track },
];
