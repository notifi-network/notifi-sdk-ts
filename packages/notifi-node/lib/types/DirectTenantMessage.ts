import type { Message } from './Message';

export type DirectTenantMessagePayload = Readonly<{
  message: string;
  targetTemplates?: Readonly<{
    [TargetType in 'SMS' | 'Email' | 'Telegram']?: string;
  }>;
  templateVariables?: Record<string, string>;
}>;

export type DirectTenantMessage = Message<
  'DIRECT_TENANT_MESSAGE',
  DirectTenantMessagePayload
>;

const newDirectTenantMessage = (
  payload: DirectTenantMessagePayload,
): DirectTenantMessage => {
  return {
    type: 'DIRECT_TENANT_MESSAGE',
    payload,
  };
};

export { newDirectTenantMessage };
