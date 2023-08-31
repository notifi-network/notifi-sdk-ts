import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { Types } from '@notifi-network/notifi-graphql';

const QUERY = `
query getUnreadNotificationHistoryCount {
  unreadNotificationHistoryCount {
    count
  }
}
`.trim();

const getUnreadNotificationHistoryCountImpl = makeParameterLessRequest<
  Types.GetUnreadNotificationHistoryCountQuery['unreadNotificationHistoryCount']
>(collectDependencies(QUERY), 'unreadNotificationHistoryCount');

export default getUnreadNotificationHistoryCountImpl;
