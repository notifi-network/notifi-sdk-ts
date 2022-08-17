import { ParameterLessOperation, WebhookTarget } from '../models';

export type GetWebhookTargetsResult = ReadonlyArray<WebhookTarget>;

export type GetWebhookTargetsService = Readonly<{
  getWebhookTargets: ParameterLessOperation<GetWebhookTargetsResult>;
}>;
