import { ParameterLessOperation, UserTopic } from '../models';

export type GetTopicsResult = ReadonlyArray<UserTopic>;

export type GetTopicsService = Readonly<{
  getTopics: ParameterLessOperation<GetTopicsResult>;
}>;
