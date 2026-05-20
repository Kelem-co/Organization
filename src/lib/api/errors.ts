/**
 * Centralized error normalization.
 * Maps raw API errors to a consistent NormalizedError shape.
 */

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'CANCELLED'
  | 'UNKNOWN'
  | string;

export interface FieldError {
  field: string;
  message: string;
}

export interface NormalizedError {
  code: ApiErrorCode;
  message: string;
  fieldErrors?: FieldError[];
  originalStatus?: number;
}

export class ApiError extends Error {
  readonly normalized: NormalizedError;

  constructor(normalized: NormalizedError) {
    super(normalized.message);
    this.name = 'ApiError';
    this.normalized = normalized;
  }
}

const STATUS_MESSAGES: Record<number, { code: ApiErrorCode; message: string }> = {
  401: { code: 'UNAUTHORIZED', message: 'Your session has expired. Please log in again.' },
  403: { code: 'FORBIDDEN', message: "You don't have permission to access this resource." },
  404: { code: 'NOT_FOUND', message: 'The requested resource was not found.' },
  408: { code: 'TIMEOUT', message: 'The request timed out. Please try again.' },
  422: { code: 'VALIDATION_ERROR', message: 'Please correct the highlighted fields.' },
  429: { code: 'SERVER_ERROR', message: 'Too many requests. Please wait a moment and try again.' },
  500: { code: 'SERVER_ERROR', message: 'Something went wrong on our end. Please try again shortly.' },
  502: { code: 'SERVER_ERROR', message: 'Something went wrong on our end. Please try again shortly.' },
  503: { code: 'SERVER_ERROR', message: 'Service temporarily unavailable. Please try again shortly.' },
  504: { code: 'SERVER_ERROR', message: 'The server took too long to respond. Please try again.' },
};

function extractErrorPayload(raw: unknown): {
  code?: string;
  message?: string;
  fieldErrors?: FieldError[];
} {
  if (!raw || typeof raw !== 'object') {
    return {};
  }

  const payload = raw as Record<string, unknown>;

  if (Array.isArray(payload.errors)) {
    const items = payload.errors.filter(
      (item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object',
    );

    const fieldErrors = items
      .filter(
        (item): item is Record<string, string> & { field: string; detail: string } =>
          typeof item.field === 'string' && typeof item.detail === 'string',
      )
      .map(({ field, detail }) => ({ field, message: detail }));

    const details = items
      .map((item) => (typeof item.detail === 'string' ? item.detail.trim() : ''))
      .filter(Boolean);

    const firstCode = items.find((item) => typeof item.code === 'string')?.code as string | undefined;

    return {
      code: firstCode,
      message: details.length > 0 ? details.join('. ') : undefined,
      fieldErrors: fieldErrors.length > 0 ? fieldErrors : undefined,
    };
  }

  if (payload.errors && typeof payload.errors === 'object') {
    const fieldErrors = Object.entries(payload.errors as Record<string, unknown>)
      .filter(([, value]) => typeof value === 'string')
      .map(([field, message]) => ({ field, message: message as string }));

    if (fieldErrors.length > 0) {
      return { fieldErrors };
    }
  }

  if (typeof payload.detail === 'string' && payload.detail.trim()) {
    return { message: payload.detail.trim() };
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return { message: payload.message.trim() };
  }

  return {};
}

export function normalizeError(raw: unknown, status?: number): NormalizedError {
  // Cancelled request — silent
  if (raw instanceof DOMException && raw.name === 'AbortError') {
    return { code: 'CANCELLED', message: 'Request was cancelled.' };
  }

  // Already normalized
  if (raw instanceof ApiError) {
    return raw.normalized;
  }

  // Network failure (fetch throws TypeError for network errors)
  if (raw instanceof TypeError) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Connection issue. Check your internet and try again.',
    };
  }

  // HTTP status-based errors
  if (status !== undefined) {
    const extracted = extractErrorPayload(raw);
    const mapped = STATUS_MESSAGES[status];
    if (mapped) {
      return {
        code: extracted.code ?? mapped.code,
        message: extracted.message ?? mapped.message,
        fieldErrors: extracted.fieldErrors,
        originalStatus: status,
      };
    }
    if (status >= 500) {
      return {
        code: extracted.code ?? 'SERVER_ERROR',
        message: extracted.message ?? 'Something went wrong on our end. Please try again shortly.',
        fieldErrors: extracted.fieldErrors,
        originalStatus: status,
      };
    }
    if (status >= 400) {
      return {
        code: extracted.code ?? 'UNKNOWN',
        message: extracted.message ?? 'An unexpected error occurred. Please try again.',
        fieldErrors: extracted.fieldErrors,
        originalStatus: status,
      };
    }
  }

  // Fallback
  const message =
    raw instanceof Error ? raw.message : 'An unexpected error occurred. Please try again.';
  return { code: 'UNKNOWN', message };
}
