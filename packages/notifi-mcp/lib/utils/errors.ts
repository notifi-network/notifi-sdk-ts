export class NotifiMcpError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'MISSING_CONFIG'
      | 'INVALID_CONFIG'
      | 'AUTH_FAILED'
      | 'UPSTREAM_ERROR'
      | 'STARTUP_FAILED',
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'NotifiMcpError';
  }
}

export const redactErrorMessage = (value: unknown): string => {
  if (value instanceof Error) {
    return value.message;
  }
  if (typeof value === 'string') {
    return value;
  }
  return 'Unknown error';
};

export const missingConfigError = (
  keys: ReadonlyArray<string>,
): NotifiMcpError =>
  new NotifiMcpError(
    `Missing required Notifi configuration: ${keys.join(', ')}`,
    'MISSING_CONFIG',
  );

export const invalidConfigError = (message: string): NotifiMcpError =>
  new NotifiMcpError(message, 'INVALID_CONFIG');

export const authFailedError = (cause: unknown): NotifiMcpError =>
  new NotifiMcpError(
    'Failed to authenticate with Notifi service credentials',
    'AUTH_FAILED',
    cause,
  );

export const upstreamError = (
  message: string,
  cause?: unknown,
): NotifiMcpError => new NotifiMcpError(message, 'UPSTREAM_ERROR', cause);

export const startupError = (cause: unknown): NotifiMcpError =>
  new NotifiMcpError(
    `Failed to start Notifi MCP server: ${redactErrorMessage(cause)}`,
    'STARTUP_FAILED',
    cause,
  );

export const isLikelyAuthError = (error: unknown): boolean => {
  const message = redactErrorMessage(error).toLowerCase();
  return (
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('jwt') ||
    message.includes('token') ||
    message.includes('authentication')
  );
};
