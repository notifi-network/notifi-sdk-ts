import {
  MarkNotificationsAsReadMutation,
  NotifiMutationMarkNotificationsAsReadArgs,
} from '../gql/generated';

export type MarkNotificationsAsReadService = Readonly<{
  markNotificationsAsRead: (
    variables: NotifiMutationMarkNotificationsAsReadArgs,
  ) => Promise<MarkNotificationsAsReadMutation>;
}>;
