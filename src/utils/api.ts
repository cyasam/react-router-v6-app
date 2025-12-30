import { authStorage } from '../features/auth';
import { API_URL } from '../config';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Wrapper for fetch that automatically adds authorization headers
 * @param endpoint - API endpoint (e.g., '/api/users' or full URL)
 * @param options - Fetch options with optional requireAuth flag (default: true)
 */
export async function apiFetch(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { requireAuth = true, headers = {}, ...restOptions } = options;

  // Build full URL if endpoint is relative
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  // Prepare headers
  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Add authorization header if required
  if (requireAuth) {
    const token = authStorage.getToken();
    if (token) {
      fetchHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // Make the request
  return fetch(url, {
    ...restOptions,
    headers: fetchHeaders,
  });
}

/**
 * Convenience method for GET requests
 */
export async function apiGet(
  endpoint: string,
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<Response> {
  return apiFetch(endpoint, { ...options, method: 'GET' });
}

/**
 * Convenience method for POST requests
 */
export async function apiPost(
  endpoint: string,
  body?: unknown,
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<Response> {
  return apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Convenience method for PUT requests
 */
export async function apiPut(
  endpoint: string,
  body?: unknown,
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<Response> {
  return apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Convenience method for DELETE requests
 */
export async function apiDelete(
  endpoint: string,
  options: Omit<FetchOptions, 'method' | 'body'> = {}
): Promise<Response> {
  return apiFetch(endpoint, { ...options, method: 'DELETE' });
}
