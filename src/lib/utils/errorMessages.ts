/**
 * Utility to format API errors into user-friendly messages
 */

interface ApiError {
  normalized: {
    code: string;
    message: string;
    originalStatus?: number;
    fieldErrors?: Array<{ field: string; message: string }>;
  };
}

export function formatAuthError(error: unknown): string {
  // Handle API errors
  if (error && typeof error === 'object' && 'normalized' in error) {
    const apiError = error as ApiError;
    const { code, message, originalStatus, fieldErrors } = apiError.normalized;

    // Handle field-specific errors
    if (fieldErrors && fieldErrors.length > 0) {
      return fieldErrors.map(e => {
        const fieldName = formatFieldName(e.field);
        return `${fieldName}: ${e.message}`;
      }).join('. ');
    }

    switch (code) {
      case 'UNAUTHORIZED':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'FORBIDDEN':
        return 'Access denied. Your account may not have the necessary permissions.';
      case 'NOT_FOUND':
        return 'Account not found. Please check your email or create a new account.';
      case 'VALIDATION_ERROR':
        return message || 'Please check your input and try again.';
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection.';
      case 'TIMEOUT':
        return 'Request timed out. Please try again.';
      case 'SERVER_ERROR':
        return 'Server error. Please try again later.';
      default:
        if (originalStatus === 400) {
          return message || 'Invalid request. Please check your input.';
        }

        if (originalStatus === 401) {
          return 'Invalid email or password. Please try again.';
        }

        if (originalStatus === 409) {
          return 'An account with this email already exists. Please login instead.';
        }

        return message || 'An error occurred. Please try again.';
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred. Please try again.';
}

function formatFieldName(field: string): string {
  // Convert snake_case or camelCase to Title Case
  return field
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getPasswordRequirements(): string[] {
  return [
    'At least 8 characters long',
    'Contains uppercase and lowercase letters',
    'Contains at least one number',
    'Contains at least one special character',
  ];
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
