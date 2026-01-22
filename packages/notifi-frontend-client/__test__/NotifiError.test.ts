import {
  NotifiAuthenticationError,
  NotifiError,
  NotifiTargetError,
  NotifiUnknownError,
  NotifiValidationError,
} from '../lib/errors/NotifiError';

describe('NotifiError', () => {
  describe('from()', () => {
    it('should return the same instance if already NotifiError', () => {
      const error = new NotifiTargetError('test', 'TEST_CODE');
      const result = NotifiError.from(error);
      expect(result).toBe(error);
    });

    it('should convert Payload Error with known __typename to correct subclass', () => {
      const payloadError = {
        __typename: 'TargetLimitExceededError',
        message: 'You have reached the maximum number of targets.',
      };
      const result = NotifiError.from(payloadError);
      expect(result).toBeInstanceOf(NotifiTargetError);
      expect(result.code).toBe('TargetLimitExceededError');
      expect(result.message).toBe(
        'You have reached the maximum number of targets.',
      );
      expect(result.errorType).toBe('TARGET');
    });

    it('should convert ArgumentError to NotifiValidationError', () => {
      const payloadError = {
        __typename: 'ArgumentError',
        message: 'Invalid argument',
      };
      const result = NotifiError.from(payloadError);
      expect(result).toBeInstanceOf(NotifiValidationError);
      expect(result.errorType).toBe('VALIDATION');
    });

    it('should convert UnauthorizedAccessError to NotifiAuthenticationError', () => {
      const payloadError = {
        __typename: 'UnauthorizedAccessError',
        message: 'Unauthorized',
      };
      const result = NotifiError.from(payloadError);
      expect(result).toBeInstanceOf(NotifiAuthenticationError);
      expect(result.errorType).toBe('AUTHENTICATION');
    });

    it('should convert unknown __typename to NotifiUnknownError', () => {
      const payloadError = {
        __typename: 'SomeNewErrorType',
        message: 'Unknown error',
      };
      const result = NotifiError.from(payloadError);
      expect(result).toBeInstanceOf(NotifiUnknownError);
      expect(result.code).toBe('SomeNewErrorType');
    });

    it('should convert generic Error to NotifiUnknownError', () => {
      const error = new Error('Generic error');
      const result = NotifiError.from(error);
      expect(result).toBeInstanceOf(NotifiUnknownError);
      expect(result.message).toBe('Generic error');
      expect(result.code).toBe('UNKNOWN');
    });

    it('should preserve original error name when converting generic Error', () => {
      const error = new TypeError('type error');
      const result = NotifiError.from(error);
      expect(result).toBeInstanceOf(NotifiUnknownError);
      expect(result.name).toBe('TypeError');
      expect(result instanceof Error).toBe(true);
    });

    it('should convert string to NotifiUnknownError', () => {
      const result = NotifiError.from('string error');
      expect(result).toBeInstanceOf(NotifiUnknownError);
      expect(result.message).toBe('string error');
    });

    it('should have timestamp', () => {
      const before = Date.now();
      const result = NotifiError.from('test');
      const after = Date.now();
      expect(result.timestamp).toBeGreaterThanOrEqual(before);
      expect(result.timestamp).toBeLessThanOrEqual(after);
    });

    it('should preserve cause', () => {
      const payloadError = {
        __typename: 'TargetLimitExceededError',
        message: 'test',
      };
      const result = NotifiError.from(payloadError);
      expect(result.cause).toBe(payloadError);
    });
  });
});
