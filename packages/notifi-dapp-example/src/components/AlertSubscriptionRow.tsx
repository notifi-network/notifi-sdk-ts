'use client';

import { Icon } from '@/assets/Icon';
import { useNotifiTopicContext } from '@/context/NotifiTopicContext';
import { FusionToggleEventTypeItem } from '@notifi-network/notifi-frontend-client';

import { Toggle } from './Toggle';

type AlertSubscriptionRowProps = {
  eventType: FusionToggleEventTypeItem;
  // TODO: Dynamically render UI components using fusionEventData.metadata
  // fusionEventData: Types.FusionEventData;
};

export const AlertSubscriptionRow: React.FC<AlertSubscriptionRowProps> = ({
  eventType,
}) => {
  const { isLoading, subscribeAlert, unsubscribeAlert, isAlertSubscribed } =
    useNotifiTopicContext();

  return (
    <div className="flex justify-between p-3 bg-notifi-destination-card-bg rounded border border-gray-200">
      <div className="flex text-sm font-medium text-notifi-text">
        <label>{eventType.name}</label>

        <div className="group">
          {eventType.tooltipContent ? (
            <div className="relative">
              <Icon id="info" className="text-notifi-text-light" />
              <div className="hidden group-hover:block absolute text-sm font-medium max-w-48 bg-notifi-card-bg p-4 rounded-md z-10 border border-notifi-card-border w-44 h-20 overflow-y-scroll top-[-5rem] right-[-4rem]">
                <div>{eventType.tooltipContent}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Toggle
        checked={isAlertSubscribed(eventType.name)}
        disabled={isLoading}
        onChange={
          isAlertSubscribed(eventType.name)
            ? () => unsubscribeAlert(eventType.name)
            : () => subscribeAlert(eventType)
        }
      />
    </div>
  );
};
