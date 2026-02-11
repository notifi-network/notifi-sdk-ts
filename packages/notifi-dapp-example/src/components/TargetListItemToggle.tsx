import { Icon } from '@/assets/Icon';
import { useTargetListItem } from '@/hooks/useTargetListItem';
import { Types } from '@notifi-network/notifi-graphql';
import {
  ToggleTarget,
  isTargetVerified,
  useNotifiTargetContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { TargetCta } from './TargetCta';
import { TargetListItemToggleProps } from './TargetListItem';
import { Tooltip } from './Tooltip';

export const TargetListItemToggle: React.FC<TargetListItemToggleProps> = (
  props,
) => {
  const {
    targetDocument: { targetData },
    renewTargetGroup,
  } = useNotifiTargetContext();
  const {
    isRemoveButtonAvailable,
    signupCtaProps,
    classifiedTargetListItemMessage,
  } = useTargetListItem({
    target: props.target,
    message: props.message,
  });
  const toggleTargetData = targetData[props.target];
  const isVerified =
    !!props.targetInfo && isTargetVerified(props.targetInfo?.infoPrompt);

  const userName = React.useMemo(() => {
    if (!toggleTargetData.data) return null;
    switch (props.target) {
      case 'discord':
        return (
          (toggleTargetData.data as Types.DiscordTargetFragmentFragment)
            .username ?? null
        );
      case 'slack':
        return (
          (toggleTargetData.data as Types.SlackChannelTargetFragmentFragment)
            .slackChannelName ?? null
        );
      case 'telegram':
        return (
          (toggleTargetData.data as Types.TelegramTargetFragmentFragment)
            .telegramId ?? null
        );
      default:
        return null;
    }
  }, [toggleTargetData.data, props.target]);

  return (
    <div
      className={`bg-notifi-destination-card-bg rounded-xl w-[320px] ${isRemoveButtonAvailable ? 'relative' : ''}`}
    >
      {/* ICON/ LABEL / USERNAME */}
      <div className="flex flex-row justify-between px-[14px] py-4">
        <div className="flex flex-row justify-center items-center">
          <Icon
            id={props.iconType}
            width="16px"
            height="16px"
            className="text-notifi-toggle-on-bg mr-[6px]"
          />
          <div className="font-medium text-sm text-notifi-grey-text">
            {isVerified ? `${userName}` : <label>{props.label}</label>}

            {/* TARGET SIGNUP CTA */}

            {isVerified ? (
              <TargetCta
                type={props.targetCtaType}
                targetInfoPrompt={props.targetInfo!.infoPrompt}
                isCtaDisabled={!targetData[props.target].isAvailable}
              />
            ) : null}
          </div>
        </div>
        {!isVerified ? <TargetCta {...signupCtaProps} /> : null}
      </div>
      {/* TARGET STATUS MESSAGE */}
      {classifiedTargetListItemMessage ? (
        <div className="flex flex-row justify-start items-center text-sm bg-notifi-container-bg px-[14px] py-2 rounded-b-xl text-notifi-text-light">
          {classifiedTargetListItemMessage.content}
          {classifiedTargetListItemMessage.tooltip && (
            <Tooltip>
              {classifiedTargetListItemMessage.tooltip}
              {classifiedTargetListItemMessage.tooltipEndingLink ? (
                <a
                  href={classifiedTargetListItemMessage.tooltipEndingLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {classifiedTargetListItemMessage.tooltipEndingLink.text}
                </a>
              ) : null}
            </Tooltip>
          )}
        </div>
      ) : null}
      {/* REMOVE TARGET CTA */}
      {isRemoveButtonAvailable && isVerified ? (
        <TargetCta
          type="link"
          targetInfoPrompt={{
            type: 'cta',
            message: 'Remove',
            onClick: async () => {
              const targetId = toggleTargetData.data?.id;
              renewTargetGroup({
                target: props.target as ToggleTarget,
                value: false,
                targetId,
              });
            },
          }}
        />
      ) : null}
    </div>
  );
};
