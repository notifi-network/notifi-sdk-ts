import { isAlertObsolete, isAlertPaused } from './alertUtils';

describe('alertUtils', () => {
  describe('isAlertPaused', () => {
    it('returns false when delayProcessingUntil is undefined', () => {
      expect(
        isAlertPaused({
          filterOptions: JSON.stringify({ delayProcessingUntil: undefined }),
        }),
      ).toBe(false);
    });

    it('returns false when delayProcessingUntil is an invalid date', () => {
      expect(
        isAlertPaused({
          filterOptions: JSON.stringify({
            delayProcessingUntil: 'Some invalid date',
          }),
        }),
      ).toBe(false);
    });

    it('returns true when delayProcessingUntil is in the future', () => {
      expect(
        isAlertPaused({
          filterOptions: JSON.stringify({
            delayProcessingUntil: '9999-12-31 23:59:59',
          }),
        }),
      ).toBe(true);
    });

    it('returns false when delayProcessingUntil is in the past', () => {
      expect(
        isAlertPaused({
          filterOptions: JSON.stringify({
            delayProcessingUntil: '1999-01-01 00:00:00',
          }),
        }),
      ).toBe(false);
    });
  });

  describe('isAlertObsolete', () => {
    describe('when the alertFrequency is SINGLE', () => {
      it('returns true when delayProcessingUntil is in the future', () => {
        expect(
          isAlertObsolete({
            filterOptions: JSON.stringify({
              alertFrequency: 'SINGLE',
              delayProcessingUntil: '9999-12-31 23:59:59',
            }),
          }),
        ).toBe(true);
      });

      it('returns false when delayProcessingUntil is in the past', () => {
        expect(
          isAlertObsolete({
            filterOptions: JSON.stringify({
              alertFrequency: 'SINGLE',
              delayProcessingUntil: '1999-01-01 00:00:00',
            }),
          }),
        ).toBe(false);
      });

      it('returns false when delayProcessingUntil is undefined', () => {
        expect(
          isAlertObsolete({
            filterOptions: JSON.stringify({
              alertFrequency: 'SINGLE',
              delayProcessingUntil: undefined,
            }),
          }),
        ).toBe(false);
      });

      it('returns false when delayProcessingUntil is an invalid date', () => {
        expect(
          isAlertObsolete({
            filterOptions: JSON.stringify({
              alertFrequency: 'SINGLE',
              delayProcessingUntil: 'Some invalid date',
            }),
          }),
        ).toBe(false);
      });
    });

    describe('when the alertFrequency is not SINGLE', () => {
      it('returns false when delayProcessingUntil is in the future', () => {
        expect(
          isAlertObsolete({
            filterOptions: JSON.stringify({
              alertFrequency: 'ALWAYS',
              delayProcessingUntil: '9999-12-31 23:59:59',
            }),
          }),
        ).toBe(false);
      });

      it('returns false when delayProcessingUntil is in the past', () => {
        expect(
          isAlertObsolete({
            filterOptions: JSON.stringify({
              alertFrequency: 'ALWAYS',
              delayProcessingUntil: '1999-01-01 00:00:00',
            }),
          }),
        ).toBe(false);
      });
    });

    it('returns false when filterOptions is missing', () => {
      expect(isAlertObsolete({ filterOptions: null })).toBe(false);
    });

    it('returns false when filterOptions is malformed', () => {
      expect(
        isAlertObsolete({ filterOptions: 'Not a valid JSON object' }),
      ).toBe(false);
    });
  });
});
