import { Icon } from '@/assets/Icon';
import { getFusionEventMetadata } from '@/utils/topic';
import { useNotifiTopicContext } from '@notifi-network/notifi-react';
import React from 'react';

import { TopicStandaloneRowMetadata } from './TopicList';
import { TopicStack } from './TopicStack';
import { TopicStackRowInput } from './TopicStackRowInput';

export type TopicStackRowProps = TopicStandaloneRowMetadata;

export const TopicStackRow: React.FC<TopicStackRowProps> = (props) => {
  const { getTopicStackAlertsFromTopicName } = useNotifiTopicContext();
  const topicStackAlerts = getTopicStackAlertsFromTopicName(
    props.topic.uiConfig.name,
  );
  const customIconUrl =
    getFusionEventMetadata(props.topic)?.uiConfigOverride?.customIconUrl ?? '';
  const icon =
    getFusionEventMetadata(props.topic)?.uiConfigOverride?.icon ?? 'INFO';
  const title =
    getFusionEventMetadata(props.topic)?.uiConfigOverride?.topicDisplayName ??
    '';

  const [isTopicStackRowInputVisible, setIsTopicStackRowInputVisible] =
    React.useState(false);

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
              {title}
              <div className="group inline-block align-middle">
                {props.topic.uiConfig.tooltipContent ? (
                  <div className="relative">
                    <Icon id="info" className="text-notifi-text-light" />
                    <div className="hidden group-hover:block absolute text-sm font-medium max-w-48 bg-notifi-card-bg p-4 rounded-md z-10 border border-notifi-card-border w-48 bottom-[1.5rem] right-[-5rem]">
                      <div>{props.topic.uiConfig.tooltipContent}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </label>
          </div>
        </div>
      </div>
      {topicStackAlerts.length > 0 ? (
        <div className="ml-14 flex flex-col border-t border-b border-notifi-card-border my-2 mr-6">
          {topicStackAlerts.map((topicStackAlert, id) => {
            return <TopicStack key={id} topicStackAlert={topicStackAlert} />;
          })}
        </div>
      ) : null}

      {isTopicStackRowInputVisible ? (
        <TopicStackRowInput
          setIsTopicStackRowInputVisible={setIsTopicStackRowInputVisible}
          topic={props.topic}
          onSave={() => setIsTopicStackRowInputVisible(false)}
        />
      ) : null}
      <div
        className={`${
          isTopicStackRowInputVisible || topicStackAlerts.length === 0
            ? 'border-t border-notifi-card-border'
            : ''
        } ml-14 mr-6`}
      >
        <div
          className="text-sm font-medium text-notifi-tenant-brand-bg py-2 cursor-pointer"
          onClick={() => {
            setIsTopicStackRowInputVisible(true);
          }}
        >
          + Add Pair
        </div>
      </div>
    </div>
  );
};
