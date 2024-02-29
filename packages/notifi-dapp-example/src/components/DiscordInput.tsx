import { Icon } from '@/assets/Icon';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { TargetGroupData, useNotifiTargets } from '@/hooks/useNotifiTargets';
import { formatTelegramForSubscription } from '@/utils/stringUtils';
import {
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { isValidPhoneNumber } from 'libphonenumber-js';
import React, { useCallback, useMemo } from 'react';

import { Toggle } from './Toggle';

export type DiscordInputProps = Readonly<{
  disabled: boolean;
}>;

export const DiscordInput: React.FC<DiscordInputProps> = ({ disabled }) => {
  const { formState } = useNotifiForm();
  const { setIsGlobalLoading, setGlobalError } = useGlobalStateContext();
  const { useDiscord, setUseDiscord, render } = useNotifiSubscriptionContext();
  const { frontendClient } = useNotifiClientContext();
  const { renewTargetGroups } = useNotifiTargets();

  const { phoneNumber, telegram: telegramId, email } = formState;

  const targetGroup: TargetGroupData = useMemo(
    () => ({
      name: 'Default',
      emailAddress: email === '' ? undefined : email,
      phoneNumber: isValidPhoneNumber(phoneNumber) ? phoneNumber : undefined,
      telegramId:
        telegramId === ''
          ? undefined
          : formatTelegramForSubscription(telegramId),
      discordId: !useDiscord ? 'Default' : undefined,
    }),
    [email, phoneNumber, telegramId, useDiscord, render],
  );

  const updateTargetGroup = useCallback(async () => {
    setUseDiscord(!useDiscord);
    targetGroup.discordId = !useDiscord ? 'Default' : undefined;
  }, [useDiscord, setUseDiscord]);

  const updateTarget = useCallback(async () => {
    setIsGlobalLoading(true);
    try {
      let success = false;
      const result = await renewTargetGroups(targetGroup);
      success = !!result;

      if (success) {
        const newData = await frontendClient.fetchData();
        render(newData);
      }
    } catch (e: unknown) {
      setGlobalError('ERROR: Failed to save, check console for more details');
      console.error('Failed to singup', (e as Error).message);
    }
    setIsGlobalLoading(false);
  }, [frontendClient, setGlobalError, targetGroup, renewTargetGroups, render]);

  return (
    <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
      <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
        <Icon
          id="discord-icon"
          width="17px"
          height="13px"
          className="text-notifi-button-primary-blueish-bg"
        />
        <div className="font-bold text-xs mt-2">Discord</div>
      </div>
      <div className="flex flex-row items-center justify-between w-90 mr-4">
        <div className="font-semibold text-sm ml-6">Discord Bot DM Alerts</div>
        <Toggle
          disabled={disabled}
          checked={useDiscord}
          onChange={() => {
            updateTargetGroup();
            updateTarget();
          }}
        />
      </div>
    </div>
  );
};
