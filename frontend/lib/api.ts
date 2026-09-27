import type { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(
  endpoint: string,
  method: Method = 'GET',
  body?: unknown,
  token?: string
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as ApiResponse<T>;
}

// ─── Typed API methods ────────────────────────────────────────────────────────

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, 'GET', undefined, token),

  post: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, 'POST', body, token),

  put: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, 'PUT', body, token),

  patch: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, 'PATCH', body, token),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, 'DELETE', undefined, token),
};
