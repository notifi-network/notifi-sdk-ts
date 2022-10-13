/**
 * Object describing Notification History
 *
 * @remarks
 * Object describing Notification History
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 * @property {string} filterType - Type of the filter
 *
 */

export type NotificationHistory = Readonly<{
  notificationHistory: {
    nodes: {
      id: string;
      category: string | null;
      createdDate: string;
      detail: {
        type: string;
        subject: string | null;
        message: string | null;
      } | null;
    };
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
    } | null;
  };
}>;
