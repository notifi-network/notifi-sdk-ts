import { newSimpleHealthThresholdMessage } from './SimpleHealthThresholdMessage';

describe('newSimpleHealthThresholdMessage', () => {
  it('includes the type', () => {
    const payload = { value: 0 };
    const result = newSimpleHealthThresholdMessage(payload);
    expect(result.type).toEqual('SIMPLE_HEALTH_THRESHOLD');
  });

  it('includes the value', () => {
    const payload = { value: 0 };
    const result = newSimpleHealthThresholdMessage(payload);
    expect(result.payload.value).toEqual(payload.value);
  });

  it('excludes template if undefined', () => {
    const payload = { value: 0 };
    const result = newSimpleHealthThresholdMessage(payload);
    expect(result.payload.template).toBeUndefined();
  });

  it('includes template if defined', () => {
    const payload = { value: 0, template: 'foobar' };
    const result = newSimpleHealthThresholdMessage(payload);
    expect(result.payload.template).not.toBeUndefined();
    expect(result.payload.template).toEqual(payload.template);
  });
});
