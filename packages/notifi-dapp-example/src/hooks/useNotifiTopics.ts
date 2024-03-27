import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import {
  EventTypeItem,
  FusionEventTypeItem,
  FusionToggleEventTypeItem,
  LabelEventTypeItem,
} from '@notifi-network/notifi-frontend-client';
import { resolveStringRef } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useCallback, useState } from 'react';

import { useNotifiTargets } from './useNotifiTargets';

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
  const { renewTargetGroups, targetGroup } = useNotifiTargets();

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

  const subscribeFusionAlerts = useCallback(
    async (
      topics: FusionEventTypeItem[],
    ): Promise<
      Types.CreateFusionAlertsMutation['createFusionAlerts'] | undefined
    > => {
      setIsLoading(true);
      try {
        await renewTargetGroups(targetGroup);
        const targetGroups = await frontendClient.getTargetGroups();
        const targetGroupId = targetGroups.find(
          (targetGroup) => targetGroup.name === 'Default',
        )?.id;

        if (!targetGroupId) {
          throw new Error('Failed to ensureTargetGroups');
        }

        const alerts: Types.CreateFusionAlertInput[] = topics.map((topic) => {
          const subscriptionValue = resolveStringRef(
            topic.name,
            topic.sourceAddress, // TODO: AP not yet able to set input reference
            {}, // reference inputs associated with topic.sourceAddress if type is `ref`
          );
          const fusionEventId = resolveStringRef(
            topic.name,
            topic.fusionEventId, // TODO: AP not yet able to set input reference
            {}, // reference inputs associated with topic.sourceAddress if type is `ref`
          );

          // TODO: Generate filterOptions (Now support toggle only)
          const filterOptions = undefined; // TBD: Should it be optional?

          return {
            fusionEventId,
            name: topic.name,
            targetGroupId,
            subscriptionValue,
            filterOptions, // TODO: support filterOptions using new findTenantConfig method in which the fusionEventDescriptor is available
          };
        });
        const result = await frontendClient.ensureFusionAlerts({ alerts });

        frontendClient.fetchData().then(render);
        return result;
      } catch (e) {
        setGlobalError(
          'ERROR: Fail to subscribeFusionAlerts, please try again.',
        );
        console.log(e);
      }
      setIsLoading(false);
    },
    [frontendClient, targetGroup],
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
    subscribeFusionAlerts,
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

// Only support fusion event type
export const validateTopic = (
  topic: EventTypeItem,
): topic is FusionEventTypeItem => {
  return topic.type === 'fusion';
};
