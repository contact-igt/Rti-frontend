export function safeReturnPath(value: string | null | undefined, fallback = "/applications"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("://") || value.includes("\\")) return fallback;
  try {
    const url = new URL(value, "https://rti-saathi.local");
    return url.origin === "https://rti-saathi.local" ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch {
    return fallback;
  }
}
