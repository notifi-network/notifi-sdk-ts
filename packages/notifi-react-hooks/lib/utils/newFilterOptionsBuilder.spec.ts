import newFilterOptionsBuilder from './newFilterOptionsBuilder';

describe('newFilterOptionsBuilder', () => {
  it('no options results in an empty object', () => {
    const result = newFilterOptionsBuilder().toJsonString();
    expect(result).toEqual('{}');
  });

  it('encodes threshold to a string', () => {
    const result = newFilterOptionsBuilder().withThreshold(5.5).toJsonString();
    expect(result).toEqual('{"threshold":"5.5"}');
  });

  it('encodes the frequency to a string', () => {
    const result = newFilterOptionsBuilder()
      .withAlertFrequency('ALWAYS')
      .toJsonString();
    expect(result).toEqual('{"alertFrequency":"ALWAYS"}');
  });
});
