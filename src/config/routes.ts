export const routes = {
  home: "/",
  start: "/start",
  fileRti: "/file-rti",
  track: "/track",
  applications: "/applications",
  learn: "/learn",
  login: "/login",
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

export const applicationDetailPath = (id: string) => `${routes.applications}/${id}`;
