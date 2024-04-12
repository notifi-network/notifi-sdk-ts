import { objectKeys } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { isValidPhoneNumber } from 'libphonenumber-js';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useNotifiFrontendClientContext } from './NotifiFrontendClientContext';

export type TargetGroupInput = {
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
  slackId?: string;
};

export type TargetDocument = {
  targetGroupId: string | null;
  targetInputs: TargetInputs;
  targetInfoPrompts: Partial<Record<Target, TargetInfo>>;
  targetData: TargetData;
};

type Target = 'email' | 'phoneNumber' | 'telegram' | 'discord' | 'slack';

type TargetInputForm = Record<
  Extract<Target, 'email' | 'phoneNumber' | 'telegram'>, // NOTE: only these 3 have their form input
  { value: string; error?: string }
>;

type TargetInputToggles = Record<Extract<Target, 'discord' | 'slack'>, boolean>;

type TargetInputs = TargetInputForm & TargetInputToggles;

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
  slack: { useSlack: boolean; data?: Types.SlackChannelTargetFragmentFragment }; // TODO: Add back slack after merging
};

const formatTelegramForSubscription = (telegramId: string) => {
  if (telegramId.startsWith('@')) {
    return telegramId.slice(1);
  }
  return telegramId;
};

export type UpdateTargetInputs = <T extends 'form' | 'toggle'>(
  target: T extends 'form'
    ? Extract<Target, 'email' | 'phoneNumber' | 'telegram'>
    : Extract<Target, 'discord' | 'slack'>,
  value: T extends 'form' ? { value: string; error?: string } : boolean,
) => void;

export type NotifiTargetContextType = {
  isLoading: boolean;
  error: Error | null;
  updateTargetInputs: UpdateTargetInputs;
  renewTargetGroup: () => Promise<void>;
  isChangingTargets: Record<Target, boolean>;
  targetDocument: TargetDocument;
  unVerifiedTargets: Target[];
};

const NotifiTargetContext = createContext<NotifiTargetContextType>(
  {} as NotifiTargetContextType, // intentionally empty as initial value
);

export const NotifiTargetContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
  const [targetInputs, setTargetInputs] = useState<TargetInputs>({
    email: { value: '', error: '' },
    phoneNumber: { value: '', error: '' },
    telegram: { value: '', error: '' },
    discord: false,
    slack: false,
  });
  const [isChangingTargets, setIsChangingTargets] = useState<
    Record<Target, boolean>
  >({
    email: false,
    phoneNumber: false,
    telegram: false,
    slack: false,
    discord: false,
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
    email: undefined,
    phoneNumber: undefined,
    telegram: undefined,
    discord: undefined,
    slack: undefined,
  });

  const targetGroupToBeSaved: TargetGroupInput = {
    name: 'Default',
    emailAddress:
      targetInputs.email.value === '' ? undefined : targetInputs.email.value,
    phoneNumber: isValidPhoneNumber(targetInputs.phoneNumber.value)
      ? targetInputs.phoneNumber.value
      : undefined,
    telegramId:
      targetInputs.telegram.value === ''
        ? undefined
        : formatTelegramForSubscription(targetInputs.telegram.value),
    discordId: targetInputs.discord ? 'Default' : undefined,
    slackId: targetInputs.slack ? 'Default' : undefined,
  };

  useEffect(() => {
    if (!frontendClientStatus.isAuthenticated) return;
    frontendClient.fetchData().then((data) => {
      refreshTargetDocument(data);
    });
  }, [frontendClientStatus.isAuthenticated]);

  useEffect(() => {
    if (targetData.email !== targetInputs.email.value) {
      setIsChangingTargets((prev) => ({ ...prev, email: true }));
    } else {
      setIsChangingTargets((prev) => ({ ...prev, email: false }));
    }
    if (targetData.telegram !== targetInputs.telegram.value) {
      setIsChangingTargets((prev) => ({ ...prev, telegram: true }));
    } else {
      setIsChangingTargets((prev) => ({ ...prev, telegram: false }));
    }
    if (targetData.phoneNumber !== targetInputs.phoneNumber.value) {
      setIsChangingTargets((prev) => ({ ...prev, phoneNumber: true }));
    } else {
      setIsChangingTargets((prev) => ({ ...prev, phoneNumber: false }));
    }
    if (targetData.discord.useDiscord !== targetInputs.discord) {
      setIsChangingTargets((prev) => ({ ...prev, discord: true }));
    } else {
      setIsChangingTargets((prev) => ({ ...prev, discord: false }));
    }
    if (targetData.slack.useSlack !== targetInputs.slack) {
      setIsChangingTargets((prev) => ({ ...prev, slack: true }));
    } else {
      setIsChangingTargets((prev) => ({ ...prev, slack: false }));
    }
  }, [targetInputs]);

  const unVerifiedTargets = useMemo(() => {
    const {
      email: emailInfoPrompt,
      phoneNumber: phoneNumberInfoPrompt,
      telegram: telegramInfoPrompt,
      discord: discordInfoPrompt,
    } = targetInfoPrompts;

    const unConfirmedTargets = {
      email: emailInfoPrompt?.infoPrompt.type === 'cta',
      phoneNumber: phoneNumberInfoPrompt?.infoPrompt.type === 'cta',
      telegram: telegramInfoPrompt?.infoPrompt.type === 'cta',
      slack:
        targetData.slack.useSlack &&
        discordInfoPrompt?.infoPrompt.type === 'cta' &&
        discordInfoPrompt?.infoPrompt.message === 'Enable Bot',
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

  const updateTargetInputs = useCallback(
    <T extends 'form' | 'toggle'>(
      target: T extends 'form'
        ? Extract<Target, 'email' | 'phoneNumber' | 'telegram'>
        : Extract<Target, 'discord' | 'slack'>,
      value: T extends 'form' ? { value: string; error?: string } : boolean,
    ) => {
      if (target in targetInputs) {
        setTargetInputs((prev) => ({
          ...prev,
          [target]: value,
        }));
      }
    },
    [],
  );

  const renewTargetGroup = useCallback(() => {
    setIsLoading(true);
    return frontendClient
      .ensureTargetGroup(targetGroupToBeSaved)
      .then((_result) => {
        frontendClient
          .fetchData()
          .then((data) => {
            refreshTargetDocument(data);
            setError(null);
          })
          .catch((e) => setError(e as Error))
          .finally(() => setIsLoading(false));
      })
      .catch((e) => setError(e as Error))
      .finally(() => setIsLoading(false));
  }, [frontendClient, targetGroupToBeSaved]);

  // NOTE: The followings are internal functions
  const updateTargetInfoPrompt = useCallback(
    (type: Target, infoPrompt?: TargetInfoPrompt | null) => {
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
    },
    [],
  );

  const refreshTargetDocument = useCallback((newData: Types.FetchDataQuery) => {
    const targetGroup = newData.targetGroup?.find(
      (tg) => tg?.name === 'Default',
    );
    // Update target group Id
    setTargetGroupId(targetGroup?.id ?? null);

    // Update inputs state
    setTargetInputs((prev) => ({
      ...prev,
      email: {
        value: targetGroup?.emailTargets?.[0]?.emailAddress ?? prev.email.value,
      },
      phoneNumber: {
        value:
          targetGroup?.smsTargets?.[0]?.phoneNumber ?? prev.phoneNumber.value,
      },
      telegram: {
        value:
          targetGroup?.telegramTargets?.[0]?.telegramId ?? prev.telegram.value,
      },
      discord: !!targetGroup?.discordTargets?.find(
        (it) => it?.name === 'Default',
      ),
      slack: !!targetGroup?.slackChannelTargets?.find(
        (it) => it?.name === 'Default',
      ),
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
  }, []);

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
    [frontendClient],
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
    [frontendClient],
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
    [],
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
    [],
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
                window.open(slackTarget.verificationLink, '_blank'),
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
    [],
  );

  return (
    <NotifiTargetContext.Provider
      value={{
        error,
        isLoading,
        renewTargetGroup,
        unVerifiedTargets,
        isChangingTargets,
        targetDocument: {
          targetGroupId,
          targetInputs,
          targetData,
          targetInfoPrompts,
        },
        updateTargetInputs,
      }}
    >
      {children}
    </NotifiTargetContext.Provider>
  );
};

export const useNotifiTargetContext = () => useContext(NotifiTargetContext);
