'use client';

import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import {
  EventTypeItem,
  FusionToggleEventTypeItem,
  LabelEventTypeItem,
} from '@notifi-network/notifi-frontend-client';
import { useMemo } from 'react';

import { AlertSubscriptionBlock } from './AlertSubscriptionBlock';

export type LabelWithSubTopicsEventTypeItem = LabelEventTypeItem & {
  subTopics: Array<FusionToggleEventTypeItem>;
};

type ValidTypeItem = FusionToggleEventTypeItem | LabelEventTypeItem;

export const AlertSubscription: React.FC = () => {
  const { cardConfig } = useNotifiCardContext();

  // TODO: Move to hooks
  const validateEventType = (
    eventType: EventTypeItem,
  ): eventType is ValidTypeItem => {
    // NOTE: now only support toggle fusion event type.
    // TODO: Need to support dynamic UI components based on fusionEventData.metadata
    return (
      (eventType.type === 'fusion' && eventType.selectedUIType === 'TOGGLE') ||
      eventType.type === 'label'
    );
  };

  // TODO: Move to hooks
  const { categorizedEventTypeItems, uncategorizedEventTypeItem } =
    useMemo(() => {
      const categorizedEventTypeItems: LabelWithSubTopicsEventTypeItem[] = [];
      const uncategorizedEventTypeItem: LabelWithSubTopicsEventTypeItem = {
        // NOTE: This is a placeholder for uncategorized event types. Name it as you like.
        name: 'General',
        type: 'label',
        subTopics: [],
      };
      let currentLabel: LabelWithSubTopicsEventTypeItem | undefined = undefined;
      cardConfig?.eventTypes.filter(validateEventType).forEach((row) => {
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
      return { categorizedEventTypeItems, uncategorizedEventTypeItem };
    }, [cardConfig?.eventTypes]);

  return (
    <div className="flex flex-col items-center 2xl:px-[15.75rem] xl:px-[10rem]">
      <div className="mt-4 mb-6 font-medium text-lg">
        Manage the alerts you want to receive
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {uncategorizedEventTypeItem.subTopics.length > 0 ? (
          <AlertSubscriptionBlock
            labelWithSubTopics={uncategorizedEventTypeItem}
          />
        ) : null}

        {categorizedEventTypeItems.map((labelWithSubTopics) => {
          return (
            <>
              {labelWithSubTopics.subTopics.length > 0 ? (
                <AlertSubscriptionBlock
                  key={labelWithSubTopics.name}
                  labelWithSubTopics={labelWithSubTopics}
                />
              ) : null}
            </>
          );
        })}
        {/* NOTE: below are invisible placeholder to make the layout consistent */}
        <div className="w-72 rounded-lg invisible h-0"></div>
        <div className="w-72 rounded-lg invisible h-0"></div>
      </div>
    </div>
  );
};
