import type { Message } from './Message';

export type SimpleHealthThresholdMessagePayload = Readonly<{
  value: number;
  template?: string;
}>;
export type SimpleHealthThresholdMessage = Message<
  'SIMPLE_HEALTH_THRESHOLD',
  SimpleHealthThresholdMessagePayload
>;

const newSimpleHealthThresholdMessage = (
  payload: SimpleHealthThresholdMessagePayload,
): SimpleHealthThresholdMessage => {
  return {
    type: 'SIMPLE_HEALTH_THRESHOLD',
    payload,
  };
};

export { newSimpleHealthThresholdMessage };
