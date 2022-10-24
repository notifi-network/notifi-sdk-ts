import { NotificationHistory, Operation } from '../models';

export type GetNotificationHistoryResult = NotificationHistory;

export type GetNotificationHistoryInput = Readonly<{
  first?: number;
  after?: string;
}>;

export type GetNotificationHistoryService = Readonly<{
  getNotificationHistory: Operation<
    GetNotificationHistoryInput,
    GetNotificationHistoryResult
  >;
}>;
