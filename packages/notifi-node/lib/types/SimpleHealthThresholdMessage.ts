import type { Message } from './Message';

export type SimpleHealthThresholdMessagePayload = Readonly<{
  healthValue: number;
  targetTemplates?: Readonly<{
    [TargetType in 'SMS' | 'Email' | 'Telegram']?: string;
  }>;
  templateVariables?: Record<string, string>;
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
