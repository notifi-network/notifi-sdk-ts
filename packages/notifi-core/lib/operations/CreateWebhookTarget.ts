import { Operation, WebhookPayloadFormat, WebhookTarget } from '../models';

export type CreateWebhookTargetInput = Readonly<{
  name: string;
  url: string;
  format: WebhookPayloadFormat;
  headers: ReadonlyArray<Readonly<{ key: string; value: string }>>;
}>;

export type CreateWebhookTargetResult = WebhookTarget;

export type CreateWebhookTargetService = Readonly<{
  createWebhookTarget: Operation<
    CreateWebhookTargetInput,
    CreateWebhookTargetResult
  >;
}>;
