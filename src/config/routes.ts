export const routes = {
  home: "/",
  fileRti: "/file-rti",
  track: "/track",
  applications: "/applications",
  appeal: "/appeal",
  replyAnalyser: "/reply-analyser",
  learn: "/learn",
  help: "/help",
  profile: "/profile",
  login: "/login",
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

export const applicationDetailPath = (id: string) => `${routes.applications}/${id}`;
