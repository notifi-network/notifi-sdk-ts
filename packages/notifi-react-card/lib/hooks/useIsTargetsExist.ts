import { useMemo } from 'react';

import { useNotifiSubscriptionContext } from '../context';

export const useIsTargetsExist = () => {
  const { useDiscord, email, phoneNumber, telegramId, discordTargetData } =
    useNotifiSubscriptionContext();

  const isTargetsExist = useMemo(() => {
    return (
      !!email ||
      !!phoneNumber ||
      !!telegramId ||
      (useDiscord && !!discordTargetData?.id)
    );
  }, [email, phoneNumber, telegramId, discordTargetData, useDiscord]);

  return isTargetsExist;
};
