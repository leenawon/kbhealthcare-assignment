import type { ErrorResponse } from '../types/api';

// accessToken은 React state에서 관리하며, 이 getter를 통해 API 클라이언트에 주입됩니다.
let _getAccessToken: () => string | null = () => null;

export const setAccessTokenGetter = (fn: () => string | null) => {
  _getAccessToken = fn;
};

export class ApiError extends Error {
  status: number;
  errorMessage: string;

  constructor(status: number, errorMessage: string) {
    super(errorMessage);
    this.name = 'ApiError';
    this.status = status;
    this.errorMessage = errorMessage;
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
  skipAuth = false,
): Promise<T> {
  const token = skipAuth ? null : _getAccessToken();

  const res = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error: ErrorResponse = await res.json();
    throw new ApiError(res.status, error.errorMessage);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  postPublic: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, true),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
