import type { RoutePath } from "@/config/routes";
import { routes } from "@/config/routes";

export type NavigationItem = { label: string; href: RoutePath };

export const publicNavigation: readonly NavigationItem[] = [
  { label: "Learn", href: routes.learn },
  { label: "Help", href: routes.help },
  { label: "Login", href: routes.login },
];

export const citizenNavigation: readonly NavigationItem[] = [
  { label: "File RTI", href: routes.fileRti },
  { label: "Track", href: routes.track },
  { label: "Applications", href: routes.applications },
  { label: "Profile", href: routes.profile },
];
