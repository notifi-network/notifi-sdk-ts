import { Operation, WebhookTarget } from '../models';

export type CreateWebhookTargetInput = Readonly<{
  name: string;
  value: string;
}>;

export type CreateWebhookTargetResult = WebhookTarget;

export type CreateTelegramTargetService = Readonly<{
  createTelegramTarget: Operation<
    CreateWebhookTargetInput,
    CreateWebhookTargetResult
  >;
}>;
