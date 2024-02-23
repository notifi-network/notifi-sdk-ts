'use client';

import { Icon } from '@/assets/Icon';
import { useNotifiTopics } from '@/hooks/useNotifiTopics';
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
    useNotifiTopics();

  return (
    <div className="flex justify-between p-3 bg-white  rounded border border-gray-200">
      <div className="flex">
        <label>{eventType.name}</label>

        <div className=" group">
          {eventType.tooltipContent ? (
            <Icon id="INFO" className="text-black opacity-30 " />
          ) : null}

          <div className="absolute hidden group-hover:block text-xs max-w-48 bg-white px-2 py-1 rounded z-10 border border-gray-200 top-1/2 right-1 ">
            {eventType.tooltipContent}
          </div>
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
