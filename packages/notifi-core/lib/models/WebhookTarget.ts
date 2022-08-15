export type WebhookPayloadFormat = 'RAW' | 'PAGER_DUTY';

/**
 * Target object for Webhooks
 *
 * @remarks
 * Target object for Webhook
 *
 * @property {string} id - Id of the WebhookTarget used later to be added into a TargetGroup
 * @property {string | null} name - Friendly name (must be unique)
 * @property {string} url - The url of the Webhook
 * @property {WebhookPayloadFormat} format - The format of payloads
 * @property {ReadonlyArray<Readonly<{ key: string; value: string }>>} headers - The headers associated with this webhook
 *
 */
export type WebhookTarget = Readonly<{
  id: string;
  name: string | null;
  url: string;
  format: WebhookPayloadFormat;
  headers: ReadonlyArray<Readonly<{ key: string; value: string }>>;
}>;
