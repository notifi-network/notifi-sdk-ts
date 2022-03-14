import packFilterOptions from './packFilterOptions';

describe('packFilterOptions', () => {
  it('results in an empty object with undefined options', () => {
    const result = packFilterOptions(undefined);
    expect(result).toEqual('{}');
  });

  it('results in an empty object with no options', () => {
    const result = packFilterOptions({});
    expect(result).toEqual('{}');
  });

  it('encodes threshold to a string', () => {
    const result = packFilterOptions({
      threshold: 5.5,
    });
    expect(result).toEqual('{"threshold":"5.5"}');
  });

  it('encodes the frequency to a string', () => {
    const result = packFilterOptions({
      alertFrequency: 'ALWAYS',
    });
    expect(result).toEqual('{"alertFrequency":"ALWAYS"}');
  });
});
