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
      <div className="flex text-sm font-medium">
        <label>{eventType.name}</label>

        <div className="group">
          {eventType.tooltipContent ? (
            <div className="relative">
              <Icon id="info" className="text-black opacity-30 " />
              <div className="hidden group-hover:block items-center absolute text-xs max-w-48 bg-white px-2 py-1 rounded z-10 border border-gray-200 w-44 h-14 overflow-y-scroll top-[-3.5rem] right-[-5rem] ">
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
