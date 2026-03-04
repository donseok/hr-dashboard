import { GraphQLClient, ClientError } from 'graphql-request';

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

let client: GraphQLClient | null = null;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hr-dashboard-token');
}

export function getGraphQLClient(): GraphQLClient {
  if (!client) {
    client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: () => {
        const token = getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    });
  }
  return client;
}

/** Classify errors for retry logic */
function isRetryableError(error: unknown): boolean {
  if (error instanceof ClientError) {
    const status = error.response.status;
    return status >= 500 || status === 429;
  }
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true; // network error
  }
  return false;
}

/** Sleep helper */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface GqlRequestOptions {
  /** Override token (e.g. for server-side) */
  token?: string;
  /** Max retries for 5xx / network errors (default: 2) */
  retries?: number;
  /** Signal for AbortController */
  signal?: AbortSignal;
}

/**
 * Execute a GraphQL request with automatic JWT attachment,
 * error classification, and retryable-error retry.
 */
export async function gqlRequest<T>(
  document: string,
  variables?: Record<string, unknown>,
  options: GqlRequestOptions = {},
): Promise<T> {
  const { token, retries = 2, signal } = options;
  const gqlClient = getGraphQLClient();

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      return await gqlClient.request<T>({
        document,
        variables,
        signal,
        requestHeaders: token ? headers : undefined,
      });
    } catch (error) {
      lastError = error;

      // 401 → token expired, try refresh once
      if (error instanceof ClientError && error.response.status === 401) {
        const refreshed = await tryRefreshToken();
        if (refreshed && attempt === 0) continue; // retry with new token
        handleAuthError();
        throw error;
      }

      // Retryable error → exponential backoff
      if (isRetryableError(error) && attempt < retries) {
        await sleep(Math.min(1000 * 2 ** attempt, 8000));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

/** Attempt to refresh the access token */
async function tryRefreshToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('hr-dashboard-refresh-token');
    if (!refreshToken) return false;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem('hr-dashboard-token', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('hr-dashboard-refresh-token', data.refreshToken);
    }
    return true;
  } catch {
    return false;
  }
}

/** Handle unrecoverable auth errors */
function handleAuthError() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('hr-dashboard-token');
  localStorage.removeItem('hr-dashboard-refresh-token');
  window.location.href = '/login';
}

/**
 * Extract user-friendly error message from GraphQL errors
 */
export function extractGqlError(error: unknown): string {
  if (error instanceof ClientError) {
    const gqlErrors = error.response.errors;
    if (gqlErrors?.length) {
      return gqlErrors.map((e) => e.message).join(', ');
    }
    return `서버 오류 (${error.response.status})`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
}
