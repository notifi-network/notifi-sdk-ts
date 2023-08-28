import { Types } from '@notifi-network/notifi-graphql';

import { ParameterLessOperation } from '../models';

export type GetUnreadNotificationHistoryCountService = Readonly<{
  getUnreadNotificationHistoryCount: ParameterLessOperation<
    Types.GetUnreadNotificationHistoryCountQuery['unreadNotificationHistoryCount']
  >;
}>;
