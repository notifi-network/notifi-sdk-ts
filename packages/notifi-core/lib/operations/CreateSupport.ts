import { ParameterLessOperation } from '../models';
import { SupportConversation } from '../models/SupportConversation';

export type CreateSupportResult = SupportConversation;

export type CreateSupportService = Readonly<{
  createSupport: ParameterLessOperation<CreateSupportResult>;
}>;
