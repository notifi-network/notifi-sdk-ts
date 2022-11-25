import { ParameterLessOperation } from '../models';
import { SupportConversation } from '../models/SupportConversation';

export type CreateSupportConversationResult = SupportConversation;

export type CreateSupportConversationService = Readonly<{
  createSupportConversation: ParameterLessOperation<CreateSupportConversationResult>;
}>;
