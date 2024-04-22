'use client';

import { Icon } from '@/assets/Icon';
import { useNotifiTopicContext } from '@/context/NotifiTopicContext';
import { FusionToggleEventTypeItem } from '@notifi-network/notifi-react-card';

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
    <div className="flex justify-between p-2 bg-white rounded">
      <div className="flex text-sm font-medium">
        <label className="">
          {eventType.name}{' '}
          <div className="group inline-block align-middle">
            {eventType.tooltipContent ? (
              <div className="relative">
                <Icon id="info" className="text-black opacity-30" />
                <div className="hidden group-hover:block absolute text-sm font-medium max-w-48 bg-white p-4 rounded z-10 border border-gray-200 w-44 bottom-[1.5rem] right-[-4.5rem]">
                  <div>{eventType.tooltipContent}</div>
                </div>
              </div>
            ) : null}
          </div>
        </label>
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
