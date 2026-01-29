/**
 * Base class for all Notifi errors
 */
export class NotifiError extends Error {
  readonly errorType: string;
  readonly code: string;
  readonly timestamp: number;
  readonly cause?: unknown;

  constructor(
    message: string,
    errorType: string,
    code: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorType = errorType;
    this.code = code;
    this.timestamp = Date.now();
    this.cause = cause;
  }

  /** Type guard: validate Payload Error (includes __typename) */
  private static isPayloadError(
    e: unknown,
  ): e is { __typename: string; message: string } {
    return (
      typeof e === 'object' &&
      e !== null &&
      '__typename' in e &&
      'message' in e &&
      typeof (e as Record<string, unknown>).__typename === 'string' &&
      typeof (e as Record<string, unknown>).message === 'string'
    );
  }

  /** Convert Payload Error to NotifiError using mapping */
  private static fromPayloadError(e: {
    __typename: string;
    message: string;
  }): NotifiError {
    const code = e.__typename;
    const message = e.message;

    const ErrorClass = ERROR_TYPE_MAP[code];
    if (ErrorClass) {
      return new ErrorClass(message, code, e);
    }

    return new NotifiUnknownError(message, code, e);
  }

  /** Main entry point: convert any error to NotifiError */
  static from(e: unknown): NotifiError {
    // Already NotifiError
    if (e instanceof NotifiError) {
      return e;
    }

    // Payload Error (w/ __typename)
    if (this.isPayloadError(e)) {
      return this.fromPayloadError(e);
    }

    // Generic Error
    if (e instanceof Error) {
      return new NotifiUnknownError(e.message, 'UNKNOWN', e);
    }

    // Unknown error
    return new NotifiUnknownError(String(e), 'UNKNOWN', e);
  }

  /**
   * Check payload errors and throw if exists
   * @throws {NotifiError} if payload contains errors
   */
  static throwIfPayloadError<
    T extends {
      errors?: ReadonlyArray<{
        __typename: string;
        message: string;
      } | null> | null;
    },
  >(payload: T): T {
    const errors = payload.errors;
    if (errors && errors.length > 0 && errors[0]) {
      throw NotifiError.from(errors[0]);
    }
    return payload;
  }
}

/**
 * Error for unknown/unclassified errors
 */
export class NotifiUnknownError extends NotifiError {
  constructor(message: string, code: string, cause?: unknown) {
    super(message, 'UNKNOWN', code, cause);
    // Preserve original Error name for debugging purposes
    if (cause instanceof Error) {
      this.name = cause.name;
    }
  }
}

/**
 * Error for target-related issues
 */
export class NotifiTargetError extends NotifiError {
  constructor(message: string, code: string, cause?: unknown) {
    super(message, 'TARGET', code, cause);
  }
}

/**
 * Error for authentication-related issues
 */
export class NotifiAuthenticationError extends NotifiError {
  constructor(message: string, code: string, cause?: unknown) {
    super(message, 'AUTHENTICATION', code, cause);
  }
}

/**
 * Error for validation-related issues
 */
export class NotifiValidationError extends NotifiError {
  constructor(message: string, code: string, cause?: unknown) {
    super(message, 'VALIDATION', code, cause);
  }
}

/**
 * Error type constructor
 */
type ErrorConstructor = new (
  message: string,
  code: string,
  cause?: unknown,
) => NotifiError;

/**
 * Mapping from GraphQL __typename to NotifiError subclass
 */
export const ERROR_TYPE_MAP: Record<string, ErrorConstructor> = {
  // Target errors
  TargetLimitExceededError: NotifiTargetError,
  TargetDoesNotExistError: NotifiTargetError,
  TargetAssignedToExistingTargetGroupError: NotifiTargetError,
  DuplicateSlackChannelTargetNamesError: NotifiTargetError,
  Web3TargetNotFoundError: NotifiTargetError,
  UnsupportedWeb3ProtocolError: NotifiTargetError,
  UnverifiedXmtpTargetError: NotifiTargetError,
  UnauthorizedXmtpAccountError: NotifiTargetError,
  XmtpAccountIsntConnectedWalletError: NotifiTargetError,

  // Auth errors
  UnauthorizedAccessError: NotifiAuthenticationError,

  // Validation errors
  ArgumentError: NotifiValidationError,
  ArgumentOutOfRangeError: NotifiValidationError,
  ArgumentNullError: NotifiValidationError,
};
