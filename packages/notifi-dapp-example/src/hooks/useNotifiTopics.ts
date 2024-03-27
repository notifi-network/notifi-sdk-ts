import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import {
  EventTypeItem,
  FusionToggleEventTypeItem,
  LabelEventTypeItem,
} from '@notifi-network/notifi-frontend-client';
import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useCallback, useState } from 'react';

export type LabelWithSubTopicsEventTypeItem = LabelEventTypeItem & {
  subTopics: Array<FusionToggleEventTypeItem>;
};

type ValidTypeItem = FusionToggleEventTypeItem | LabelEventTypeItem;

/**
 * @description Two important Notifi concepts: `Topic`(=EventTypeItem) and `Alert`.
 * - `Topic` is the event allowed to be subscribed (Tenant specific).
 * - `Alert` is the subscription of the `Topic` (User specific).
 * Once a user subscribes to a `Topic`, he/she will has an `Alert` object.
 */

export const useNotifiTopics = () => {
  const { inputs } = useNotifiTenantConfig();
  const { frontendClient } = useNotifiClientContext();
  const { render, alerts } = useNotifiSubscriptionContext();
  const [isLoading, setIsLoading] = useState(false);
  const { setGlobalError } = useGlobalStateContext();

  const subscribeAlert = useCallback(
    (topic: EventTypeItem) => {
      setIsLoading(true);
      frontendClient
        .ensureAlert({ eventType: topic, inputs })
        .then(() => {
          frontendClient.fetchData().then(render);
        })
        .catch((e) => {
          setGlobalError('ERROR: Fail to subscribe alert, plase try again.');
          console.log(e);
        })
        .finally(() => setIsLoading(false));
    },
    [frontendClient],
  );

  const unsubscribeAlert = useCallback(
    (topicName: string) => {
      setIsLoading(true);
      const alert = alerts[topicName];
      if (!alert) return;
      frontendClient
        .deleteAlert({ id: alert.id })
        .then(() => {
          frontendClient.fetchData().then(render);
        })
        .catch((e) => {
          setGlobalError('ERROR: Fail to unsubscribe alert, plase try again.');
          console.log(e);
        })
        .finally(() => setIsLoading(false));
    },
    [alerts, frontendClient],
  );

  const isAlertSubscribed = useCallback(
    (topicName: string) => {
      return Object.keys(alerts).includes(topicName);
    },
    [alerts],
  );

  return {
    isLoading,
    subscribeAlert,
    unsubscribeAlert,
    isAlertSubscribed,
  };
};

const validateEventType = (
  eventType: EventTypeItem,
): eventType is ValidTypeItem => {
  // NOTE: now only support toggle fusion event type.
  // TODO: allow dynamic UI components based on fusionEventData.metadata
  return (
    (eventType.type === 'fusion' && eventType.selectedUIType === 'TOGGLE') ||
    eventType.type === 'label'
  );
};

export const categorizeTopics = (
  topics: ReadonlyArray<EventTypeItem>,
  unCategorizedTopicsLabelName?: string,
) => {
  const categorizedEventTypeItems: LabelWithSubTopicsEventTypeItem[] = [];
  const uncategorizedEventTypeItem: LabelWithSubTopicsEventTypeItem = {
    name: unCategorizedTopicsLabelName ?? 'General',
    type: 'label',
    subTopics: [],
  };
  let currentLabel: LabelWithSubTopicsEventTypeItem | undefined = undefined;
  topics.filter(validateEventType).forEach((row) => {
    if (row.type === 'label') {
      currentLabel = {
        ...row,
        subTopics: [],
      };
      categorizedEventTypeItems.push(currentLabel);
    } else {
      if (currentLabel) {
        currentLabel.subTopics.push(row);
      } else {
        uncategorizedEventTypeItem.subTopics.push(row);
      }
    }
  });
  return {
    categorizedTopics: categorizedEventTypeItems,
    uncategorizedTopics: uncategorizedEventTypeItem,
  };
};
