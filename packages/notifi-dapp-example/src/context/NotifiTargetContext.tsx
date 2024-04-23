'use client';

import { formatTelegramForSubscription } from '@/utils/stringUtils';
import { objectKeys } from '@/utils/typeUtils';
import { Types } from '@notifi-network/notifi-graphql';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useGlobalStateContext } from './GlobalStateContext';
import { useNotifiFrontendClientContext } from './NotifiFrontendClientContext';

export type TargetGroupData = {
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
  slackId?: string;
};

export type TargetDocument = {
  targetGroupId: string | null;
  targetInputForm: TargetInputForm;
  targetInfoPrompts: Partial<Record<Target, TargetInfo>>;
  targetData: TargetData;
};

type Target = 'email' | 'phoneNumber' | 'telegram' | 'discord' | 'slack';

type TargetInputForm = Record<
  Extract<Target, 'email' | 'phoneNumber' | 'telegram'>, // NOTE: only these 3 have their form input
  { value: string; error?: string }
>;

export type TargetInfo = {
  target: Target;
  infoPrompt: TargetInfoPrompt;
};

export type TargetInfoPrompt = CtaInfo | ErrorInfo;

export const isCtaInfo = (info: TargetInfoPrompt): info is CtaInfo =>
  'onClick' in info;

export type CtaInfo = {
  type: 'cta';
  message: string;
  onClick: () => void;
};

export type ErrorInfo = {
  type: 'error';
  message: string;
};

export type TargetData = {
  email: string;
  phoneNumber: string;
  telegram: string;
  discord: { useDiscord: boolean; data?: Types.DiscordTargetFragmentFragment };
  slack: { useSlack: boolean; data?: Types.SlackChannelTargetFragmentFragment };
};

export type NotifiTargetContextType = {
  isLoading: boolean;
  targetGroup: TargetGroupData;
  updateTarget: (target: Target) => Promise<void>;
  renewTargetGroups: (
    targetGroup: TargetGroupData,
  ) => Promise<Types.TargetGroupFragmentFragment>;
  unVerifiedTargets: Target[];
  hasEmailChanges: boolean;
  setHasEmailChanges: Dispatch<SetStateAction<boolean>>;
  hasTelegramChanges: boolean;
  setHasTelegramChanges: Dispatch<SetStateAction<boolean>>;
  targetDocument: TargetDocument;
  refreshTargetDocument: (newData: Types.FetchDataQuery) => void;
  updateTargetForms: (
    target: Extract<Target, 'email' | 'phoneNumber' | 'telegram'>,
    value: string,
    error?: string,
  ) => void;
  updateUseDiscord: (useDiscord: boolean) => void;
  updateUseSlack: (useSlack: boolean) => void;
};

const NotifiTargetContext = createContext<NotifiTargetContextType>(
  {} as NotifiTargetContextType, // intentionally empty as initial value
);

export const NotifiTargetContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();

  const { setGlobalError } = useGlobalStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
  const [targetInputForm, setTargetInputForm] = useState<TargetInputForm>({
    email: { value: '' },
    phoneNumber: { value: '' },
    telegram: { value: '' },
  });
  const [targetData, setTargetData] = useState<TargetData>({
    email: '',
    phoneNumber: '',
    telegram: '',
    discord: { useDiscord: false },
    slack: { useSlack: false },
  });
  const [targetInfoPrompts, setTargetInfoPrompts] = useState<
    Partial<Record<Target, TargetInfo>>
  >({
    // TODO: {} as init value
    email: undefined,
    phoneNumber: undefined,
    telegram: undefined,
    discord: undefined,
    slack: undefined,
  });

  useEffect(() => {
    if (!frontendClientStatus.isAuthenticated) return;
    frontendClient.fetchData().then((data) => {
      refreshTargetDocument(data);
    });
  }, [frontendClient, frontendClientStatus]);

  const [hasEmailChanges, setHasEmailChanges] = useState<boolean>(false);
  const [hasTelegramChanges, setHasTelegramChanges] = useState<boolean>(false);

  const targetGroup: TargetGroupData = {
    name: 'Default',
    emailAddress:
      targetInputForm.email.value === ''
        ? undefined
        : targetInputForm.email.value,
    phoneNumber: isValidPhoneNumber(targetInputForm.phoneNumber.value)
      ? targetInputForm.phoneNumber.value
      : undefined,
    telegramId:
      targetInputForm.telegram.value === ''
        ? undefined
        : formatTelegramForSubscription(targetInputForm.telegram.value),
    discordId: targetData.discord.useDiscord ? 'Default' : undefined,
    slackId: targetData.slack.useSlack ? 'Default' : undefined,
  };

  const renewTargetGroups = useCallback(
    (targetGroup: TargetGroupData) => {
      setIsLoading(true);
      return frontendClient
        .ensureTargetGroup(targetGroup)
        .finally(() => setIsLoading(false));
    },
    [frontendClient],
  );

  const afterEditDestination = (target: Target) => {
    switch (target) {
      case 'email':
        setHasEmailChanges(false);
        break;
      case 'telegram':
        setHasTelegramChanges(false);
        break;
      default:
        break;
    }
  };

  const updateTarget = useCallback(
    async (target: Target) => {
      setIsLoading(true);
      try {
        let success = false;
        if (target === 'discord') {
          setTargetData((prev) => ({
            ...prev,
            discord: { useDiscord: !targetData.discord.useDiscord },
          }));
          targetGroup.discordId = !targetData.discord.useDiscord
            ? 'Default'
            : undefined;
        }

        if (target === 'slack') {
          setTargetData((prev) => ({
            ...prev,
            slack: { useSlack: !targetData.slack.useSlack },
          }));
          targetGroup.slackId = !targetData.slack.useSlack
            ? 'Default'
            : undefined;
        }
        const result = await renewTargetGroups(targetGroup);
        success = !!result;

        if (success) {
          const newData = await frontendClient.fetchData();
          refreshTargetDocument(newData);
          afterEditDestination(target);
        }
      } catch (e: unknown) {
        setGlobalError('ERROR: Failed to save, plase try again.');
        console.error('Failed to singup', (e as Error).message);
      }
      setIsLoading(false);
    },
    [
      frontendClient,
      setGlobalError,
      targetGroup,
      targetData.slack.useSlack,
      targetData.discord.useDiscord,
    ],
  );

  const updateTargetInfoPrompt = (
    type: Target,
    infoPrompt?: TargetInfoPrompt | null,
  ) => {
    if (!infoPrompt) {
      setTargetInfoPrompts((prev) => ({
        ...prev,
        [type]: undefined,
      }));
      return;
    }
    setTargetInfoPrompts((prev) => ({
      ...prev,
      [type]: {
        target: type,
        infoPrompt,
      },
    }));
  };

  const updateUseDiscord = (useDiscord: boolean) => {
    setTargetData((prev) => ({
      ...prev,
      discord: { useDiscord },
    }));
  };

  const updateUseSlack = (useSlack: boolean) => {
    setTargetData((prev) => ({
      ...prev,
      slack: { useSlack },
    }));
  };

  const updateTargetForms = (
    target: Extract<Target, 'email' | 'telegram' | 'phoneNumber'>,
    value: string,
    error?: string,
  ) => {
    setTargetInputForm((prev) => ({
      ...prev,
      [target]: { value, error },
    }));
  };

  const refreshTargetDocument = useCallback(
    (newData: Types.FetchDataQuery) => {
      const targetGroup = newData.targetGroup?.find(
        (tg) => tg?.name === 'Default',
      );
      // Update target group Id
      setTargetGroupId(targetGroup?.id ?? null);

      // Update form state
      setTargetInputForm((prev) => ({
        ...prev,
        email: {
          value:
            targetGroup?.emailTargets?.[0]?.emailAddress ?? prev.email.value,
        },
        phoneNumber: {
          value:
            targetGroup?.smsTargets?.[0]?.phoneNumber ?? prev.phoneNumber.value,
        },
        telegram: {
          value:
            targetGroup?.telegramTargets?.[0]?.telegramId ??
            prev.telegram.value,
        },
      }));

      // Update target data (TargetData) & info prompts (TargetInfoPrompt)
      const emailTarget = targetGroup?.emailTargets?.[0];
      refreshEmailTarget(emailTarget);

      const smsTarget = targetGroup?.smsTargets?.[0];
      refreshSmsTarget(smsTarget);

      const telegramTarget = targetGroup?.telegramTargets?.[0];
      refreshTelegramTarget(telegramTarget);

      const discordTarget = targetGroup?.discordTargets?.find(
        (it) => it?.name === 'Default',
      );
      refreshDiscordTarget(discordTarget);

      const slackTarget = targetGroup?.slackChannelTargets?.find(
        (it) => it?.name === 'Default',
      );
      refreshSlackTarget(slackTarget);
    },
    [frontendClient],
  );

  const refreshEmailTarget = useCallback(
    async (emailTarget?: Types.EmailTargetFragmentFragment) => {
      setTargetData((prev) => ({
        ...prev,
        email: emailTarget?.emailAddress ?? '',
      }));
      if (!!emailTarget && !emailTarget.isConfirmed) {
        updateTargetInfoPrompt('email', {
          type: 'cta',
          message: 'Resend Link',
          onClick: () =>
            frontendClient.sendEmailTargetVerification({
              targetId: emailTarget.id,
            }),
        });
      } else {
        updateTargetInfoPrompt('email', null);
      }
    },
    [frontendClient, updateTargetInfoPrompt],
  );

  const refreshSmsTarget = useCallback(
    async (smsTarget?: Types.SmsTargetFragmentFragment) => {
      setTargetData((prev) => ({
        ...prev,
        phoneNumber: smsTarget?.phoneNumber ?? '',
      }));
      if (!!smsTarget?.phoneNumber && !smsTarget?.isConfirmed) {
        updateTargetInfoPrompt('phoneNumber', {
          type: 'error',
          message: 'Messages stopped',
        });
      } else {
        updateTargetInfoPrompt('phoneNumber', null);
      }
    },
    [frontendClient, updateTargetInfoPrompt],
  );

  const refreshTelegramTarget = useCallback(
    async (telegramTarget?: Types.TelegramTargetFragmentFragment) => {
      setTargetData((prev) => ({
        ...prev,
        telegram: telegramTarget?.telegramId ?? '',
      }));
      if (!!telegramTarget && !telegramTarget.isConfirmed) {
        updateTargetInfoPrompt('telegram', {
          type: 'cta',
          message: 'Verify ID',
          onClick: () => {
            if (!telegramTarget?.confirmationUrl) {
              return;
            }
            window.open(telegramTarget?.confirmationUrl);
          },
        });
      } else {
        updateTargetInfoPrompt('telegram', null);
      }
    },
    [frontendClient, updateTargetInfoPrompt],
  );

  const refreshDiscordTarget = useCallback(
    async (discordTarget?: Types.DiscordTargetFragmentFragment) => {
      if (!!discordTarget && !discordTarget.isConfirmed) {
        updateTargetInfoPrompt('discord', {
          type: 'cta',
          message: 'Enable Bot',
          onClick: () => window.open(discordTarget.verificationLink, '_blank'),
        });
        setTargetData((prev) => ({
          ...prev,
          discord: { useDiscord: true, data: discordTarget },
        }));
      } else if (!!discordTarget && discordTarget.isConfirmed) {
        switch (discordTarget.userStatus) {
          case 'DISCORD_SERVER_NOT_JOINED':
            updateTargetInfoPrompt('discord', {
              type: 'cta',
              message: 'Join Server',
              onClick: () =>
                window.open(discordTarget.discordServerInviteLink, '_blank'),
            });
            break;
          case 'COMPLETE':
            updateTargetInfoPrompt('discord', null);
            break;
          default: // UNVERIFIED: Should never get in this state
            throw new Error('Discord target in unexpected state');
        }
        setTargetData((prev) => ({
          ...prev,
          discord: { useDiscord: true, data: discordTarget },
        }));
      } else {
        setTargetData((prev) => ({
          ...prev,
          discord: {
            useDiscord: false,
          },
        }));
      }
    },
    [frontendClient],
  );

  const refreshSlackTarget = useCallback(
    async (slackTarget?: Types.SlackChannelTargetFragmentFragment) => {
      if (slackTarget) {
        switch (slackTarget.verificationStatus) {
          case 'UNVERIFIED':
          case 'MISSING_PERMISSIONS':
          case 'MISSING_CHANNEL':
            updateTargetInfoPrompt('slack', {
              type: 'cta',
              message: 'Enable Bot',
              onClick: () =>
                window.open(slackTarget.webhookVerificationLink, '_blank'),
            });
            break;
          case 'VERIFIED':
            updateTargetInfoPrompt('slack', null);
            break;
          default:
            throw new Error('Slack target in unexpected state');
        }
        setTargetData((prev) => ({
          ...prev,
          slack: { useSlack: true, data: slackTarget },
        }));
      } else {
        setTargetData((prev) => ({
          ...prev,
          slack: { useSlack: false },
        }));
      }
    },
    [frontendClient],
  );

  const unVerifiedTargets = useMemo(() => {
    const {
      email: emailInfoPrompt,
      phoneNumber: phoneNumberInfoPrompt,
      telegram: telegramInfoPrompt,
      discord: discordInfoPrompt,
      slack: slackInfoPrompt,
    } = targetInfoPrompts;

    const unConfirmedTargets = {
      email: emailInfoPrompt?.infoPrompt.type === 'cta',
      phoneNumber: phoneNumberInfoPrompt?.infoPrompt.type === 'cta',
      telegram: telegramInfoPrompt?.infoPrompt.type === 'cta',
      slack:
        targetData.slack.useSlack &&
        slackInfoPrompt?.infoPrompt.type === 'cta' &&
        slackInfoPrompt?.infoPrompt.message === 'Enable Bot',
      discord:
        targetData.discord.useDiscord &&
        discordInfoPrompt?.infoPrompt.type === 'cta' &&
        discordInfoPrompt?.infoPrompt.message === 'Enable Bot',
    };
    return objectKeys(unConfirmedTargets)
      .map((key) => {
        if (unConfirmedTargets[key]) {
          return key;
        }
      })
      .filter((item): item is Target => !!item);
  }, [targetInfoPrompts, targetData]);

  return (
    <NotifiTargetContext.Provider
      value={{
        isLoading,
        targetGroup,
        updateTarget,
        renewTargetGroups,
        unVerifiedTargets,
        hasEmailChanges,
        setHasEmailChanges,
        hasTelegramChanges,
        setHasTelegramChanges,
        targetDocument: {
          targetGroupId: targetGroupId,
          targetInputForm,
          targetData,
          targetInfoPrompts,
        },
        refreshTargetDocument,
        updateTargetForms,
        updateUseDiscord,
        updateUseSlack,
      }}
    >
      {children}
    </NotifiTargetContext.Provider>
  );
};

export const useNotifiTargetContext = () => useContext(NotifiTargetContext);
