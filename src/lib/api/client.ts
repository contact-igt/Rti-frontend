const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return response.json().catch(() => undefined);
  return response.text().catch(() => undefined);
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, token, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    cache: "no-store",
    ...requestOptions,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data && typeof data.message === "string"
      ? data.message
      : `Request failed with status ${response.status}`;
    const code = typeof data === "object" && data && "error" in data && typeof data.error === "object" && data.error && "code" in data.error && typeof data.error.code === "string"
      ? data.error.code
      : undefined;
    throw new ApiError(message, response.status, data, code);
  }
  return data as T;
}
