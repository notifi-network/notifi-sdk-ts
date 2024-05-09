'use client';

import { Icon } from '@/assets/Icon';
import {
  AlertFilter,
  FusionEventMetadata,
  FusionEventTopic,
} from '@notifi-network/notifi-frontend-client';
import {
  useNotifiTargetContext,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react';
import { useMemo } from 'react';
import React from 'react';

import { AlertSubscriptionOptions } from './AlertSubscriptionOptions';
import { Toggle } from './Toggle';

type AlertSubscriptionRowProps = {
  topic: FusionEventTopic;
  // TODO: Dynamically render UI components using fusionEventData.metadata
  // fusionEventData: Types.FusionEventData;
};

export const AlertSubscriptionRow: React.FC<AlertSubscriptionRowProps> = ({
  topic,
}) => {
  const [isAddPairOpen, setIsAddPairOpen] = React.useState<boolean>(false);
  const dummyList = [
    'ETH / USDC - Chain',
    'ETH / USDC - Chain',
    'ETH / USDC - Chain',
  ];
  const tradingPairAlertsList = [
    { 'ETH / USDC - Chain': 'Above 15928.00' },
    { 'ETH / USDC - Chain': 'Above 15928.00' },
  ];
  const {
    isAlertSubscribed,
    isLoading: isLoadingTopic,
    subscribeAlertsDefault,
    unsubscribeAlert,
  } = useNotifiTopicContext();

  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  const metadata = topic.fusionEventDescriptor?.metadata ?? null;

  if (!metadata) return null;

  const parsedMetadata: FusionEventMetadata | null = metadata
    ? (JSON.parse(metadata) as FusionEventMetadata)
    : null;

  const icon = parsedMetadata?.uiConfigOverride?.icon ?? 'INFO';
  const customIconUrl = parsedMetadata?.uiConfigOverride?.customIconUrl ?? '';
  const topicDisplayName =
    parsedMetadata?.uiConfigOverride?.topicDisplayName &&
    parsedMetadata?.uiConfigOverride?.topicDisplayName !== ''
      ? parsedMetadata?.uiConfigOverride?.topicDisplayName
      : topic.uiConfig.name;
  const description = useMemo(() => {
    const filters = (parsedMetadata?.filters as AlertFilter[]) ?? [];
    return filters[0]?.description ?? '';
  }, [topic]);
  const userInputParams = useMemo(() => {
    const filters = (parsedMetadata?.filters as AlertFilter[]) ?? [];
    return filters[0]?.userInputParams ?? [];
  }, [topic]);

  return (
    <div className="flex flex-col p-2 px-4 bg-notifi-destination-card-bg rounded-md w-[359px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-row justify-center items-center text-sm font-regular text-notifi-text">
          <div className="flex flex-row items-center">
            {customIconUrl.length > 0 ? (
              <>
                <img src={customIconUrl} className="w-10 h-10 mr-3 ml-1" />
              </>
            ) : (
              <div className={`h-10 w-10 mr-3 ml-1`}>
                <Icon className="m-2" id={icon} />
              </div>
            )}
            <label>
              {topicDisplayName}
              <div className="group inline-block align-middle">
                {topic.uiConfig.tooltipContent ? (
                  <div className="relative">
                    <Icon id="info" className="text-notifi-text-light" />
                    <div className="hidden group-hover:block absolute text-sm font-medium max-w-48 bg-notifi-card-bg p-4 rounded-md z-10 border border-notifi-card-border w-48 bottom-[1.5rem] right-[-5rem]">
                      <div>{topic.uiConfig.tooltipContent}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </label>
          </div>
        </div>
        {/* hide toggle button if it is the Trading Pair Price Alert, but shown save button instead below */}
        {userInputParams.length > 1 ? null : (
          <Toggle
            checked={isAlertSubscribed(topic.uiConfig.name)}
            disabled={isLoadingTopic}
            onChange={() => {
              if (!targetGroupId) return;
              if (!isAlertSubscribed(topic.uiConfig.name)) {
                return subscribeAlertsDefault([topic], targetGroupId);
              }
              unsubscribeAlert(topic.uiConfig.name);
            }}
          />
        )}
      </div>

      {/* show Trading Pair Price Alert list if there are any
      using dummy data now TODO: update with real */}
      {userInputParams.length > 1 ? (
        <div className="ml-14 flex flex-col border-t border-b border-notifi-card-border mt-2 mb-4 mr-6">
          {tradingPairAlertsList.map((item, index) => (
            <div className="flex flex-row justify-between items-center py-3">
              <div key={index} className="flex flex-col items-start">
                <div className="text-sm font-regular text-notifi-text">
                  {Object.keys(item)[0]}
                </div>
                <div className="text-xs font-regular text-notifi-text-light">
                  {Object.values(item)[0]}
                </div>
              </div>
              <Icon
                id="trash-btn"
                className="text-notifi-text-light top-6 left-4 cursor-pointer"
                // onClick={() => unsubscribeAlert(topic.uiConfig.name)}
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* show dropdown button for Trading Pair Price Alert */}
      {/* TODO: pass in a variable from AP to determine if the dropdown should be shown */}
      {userInputParams.length > 1 ? (
        <select className="ml-14 w-60 h-12 bg-notifi-card-bg rounded-md mb-3 text-notifi-text p-2 border-0 focus:border-0 focus-visible:border-0">
          {dummyList.map((item) => (
            <option
              key={item}
              value={item}
              className="ml-14 w-60 h-12 bg-notifi-card-bg rounded-md mb-3 text-notifi-text p-2"
            >
              {item}
            </option>
          ))}
        </select>
      ) : null}

      {/* render radio button or button inputs if content with userInputParams length equals to 1 */}
      {userInputParams.length === 1 &&
      isAlertSubscribed(topic.uiConfig.name) ? (
        <div>
          {userInputParams.map((userInput, id) => {
            return (
              <AlertSubscriptionOptions
                index={id}
                key={id}
                userInputParam={userInput}
                topic={topic}
                description={description}
              />
            );
          })}
        </div>
      ) : null}

      {/* render radio button or button inputs if content with userInputParams length larger than 1, for GMX, it is the Trading Pair Price Alert */}
      {userInputParams.length > 1 && isAddPairOpen ? (
        <div>
          {userInputParams.map((userInput, id) => {
            return (
              <AlertSubscriptionOptions
                index={id}
                key={id}
                userInputParam={userInput}
                topic={topic}
                description={description}
              />
            );
          })}
          <button
            className="ml-14 h-9 w-18 rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text mt-1 mb-4"
            onClick={() => {
              if (!targetGroupId) return;
              if (!isAlertSubscribed(topic.uiConfig.name)) {
                // TODO: update logic here to subscribe not based on the name
                // subscribeAlertsDefault([topic], targetGroupId);
              }
              setIsAddPairOpen(false);
            }}
          >
            Save
          </button>
        </div>
      ) : null}

      {/* add pair for Trading Pair Price Alert  */}
      {userInputParams.length > 1 ? (
        <div className="border-t border-notifi-card-border ml-14 mr-6">
          <div
            className="text-sm font-medium text-notifi-tenant-brand-bg py-2 cursor-pointer"
            onClick={() => setIsAddPairOpen(true)}
          >
            + Add Pair
          </div>
        </div>
      ) : null}
    </div>
  );
};
