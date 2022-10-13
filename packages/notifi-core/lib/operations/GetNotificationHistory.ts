import { NotificationHistory, ParameterLessOperation } from '../models';

export type GetNotificationHistoryResult = ReadonlyArray<NotificationHistory>;

export type GetNotificationHistoryService = Readonly<{
  getNotificationHistory: ParameterLessOperation<GetNotificationHistoryResult>;
}>;
