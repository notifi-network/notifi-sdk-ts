import {
  NotifiFrontendClient,
  objectKeys,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import type { NotifiWalletTargetContextType } from '@notifi-network/notifi-react-wallet-target-plugin';
import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  AlterTargetGroupParams,
  UpdateTargetsParam,
} from 'notifi-frontend-client/lib/client/alterTargetGroup';
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

import { formTargets, toggleTargets } from '../utils';
import { useNotifiFrontendClientContext } from './NotifiFrontendClientContext';

export type TargetGroupInput = {
  name: string;
  emailAddress?: string;
  phoneNumber?: string;
  telegramId?: string;
  discordId?: string;
  slackId?: string;
  walletId?: string;
};

export type TargetDocument = {
  targetGroupId: string | null;
  targetInputs: TargetInputs;
  targetInfoPrompts: Partial<Record<Target, TargetInfo>>;
  targetData: TargetData;
};

export type Target = FormTarget | ToggleTarget;

export type FormTarget = (typeof formTargets)[number];
export type ToggleTarget = (typeof toggleTargets)[number];

export type TargetInputFromValue = { value: string; error?: string };
type TargetInputForm = Record<FormTarget, TargetInputFromValue>;

export type TargetInputToggles = Record<ToggleTarget, boolean>;

export type TargetInputs = TargetInputForm & TargetInputToggles;

export type TargetInfo = {
  target: Target;
  infoPrompt: TargetInfoPrompt;
};

export type TargetInfoPrompt = CtaInfo | MessageInfo;

export const isCtaInfo = (info: TargetInfoPrompt): info is CtaInfo =>
  'onClick' in info;

export type CtaInfo = {
  type: 'cta';
  message: string;
  onClick: () => void;
};

export type MessageInfo = {
  type: 'error' | 'message';
  message: string;
};

export type TargetData = {
  email: string;
  phoneNumber: string;
  telegram: {
    useTelegram: boolean;
    data?: Types.TelegramTargetFragmentFragment;
    // NOTE: available by default
    isAvailable: boolean;
  };
  discord: {
    useDiscord: boolean;
    data?: Types.DiscordTargetFragmentFragment;
    // NOTE: available by default
    isAvailable: boolean;
  };
  slack: {
    useSlack: boolean;
    data?: Types.SlackChannelTargetFragmentFragment;
    // NOTE: available by default
    isAvailable: boolean;
  };
  wallet: {
    useWallet: boolean;
    data?: Types.Web3TargetFragmentFragment;
    /* NOTE: unavailable by default.
     * The condition now determine whether the `wallet` target is available or not is if the dapp connects to `coinbase` wallet. But we are not able to know the information in "notifi-react" library Level.
     */
    isAvailable?: boolean;
  };
};

export type UpdateTargetInputs = <T extends 'form' | 'toggle'>(
  target: T extends 'form' ? FormTarget : ToggleTarget,
  value: T extends 'form' ? TargetInputFromValue : boolean,
) => void;

type FormTargetRenewArgs = {
  target: FormTarget;
  value: string;
};

type ToggleTargetRenewArgs = {
  target: ToggleTarget;
  value: boolean;
};

type TargetRenewArgs = FormTargetRenewArgs | ToggleTargetRenewArgs;

const isFormTargetRenewArgs = (
  args: TargetRenewArgs,
): args is FormTargetRenewArgs => {
  return formTargets.includes(args.target as FormTarget);
};

const isToggleTargetRenewArgs = (
  args: TargetRenewArgs,
): args is ToggleTargetRenewArgs => {
  return toggleTargets.includes(args.target as ToggleTarget);
};

type TargetPlugin = {
  walletTarget: NotifiWalletTargetContextType;
};

export type NotifiTargetContextType = {
  isLoading: boolean;
  error: Error | null;
  updateTargetInputs: UpdateTargetInputs;
  renewTargetGroup: (
    singleTargetRenewArgs?: TargetRenewArgs,
  ) => Promise<Types.TargetGroupFragmentFragment | null>;
  isChangingTargets: Record<Target, boolean>;
  targetDocument: TargetDocument;
  unVerifiedTargets: Target[];
  plugin?: TargetPlugin;
};

const NotifiTargetContext = createContext<NotifiTargetContextType>(
  {} as NotifiTargetContextType, // intentionally empty as initial value
);

export type NotifiTargetContextProviderProps = {
  toggleTargetAvailability?: Partial<Record<ToggleTarget, boolean>>;
  plugin?: TargetPlugin;
};

export const NotifiTargetContextProvider: FC<
  PropsWithChildren<NotifiTargetContextProviderProps>
> = ({ children, toggleTargetAvailability, plugin }) => {
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoaded = React.useRef(false);
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
  const [targetInputs, setTargetInputs] = useState<TargetInputs>({
    email: { value: '', error: '' },
    phoneNumber: { value: '', error: '' },
    telegram: false,
    discord: false,
    slack: false,
    wallet: false,
  });
  const [isChangingTargets, setIsChangingTargets] = useState<
    Record<Target, boolean>
  >({
    email: false,
    phoneNumber: false,
    telegram: false,
    slack: false,
    discord: false,
    wallet: false,
  });
  const [targetData, setTargetData] = useState<TargetData>({
    email: '',
    phoneNumber: '',
    telegram: {
      useTelegram: false,
      isAvailable: toggleTargetAvailability?.telegram ?? true,
    },
    discord: {
      useDiscord: false,
      isAvailable: toggleTargetAvailability?.discord ?? true,
    },
    slack: {
      useSlack: false,
      isAvailable: toggleTargetAvailability?.slack ?? true,
    },
    wallet: {
      useWallet: false,
      isAvailable: toggleTargetAvailability?.wallet ?? false,
    },
  });
  const [targetInfoPrompts, setTargetInfoPrompts] = useState<
    Partial<Record<Target, TargetInfo>>
  >({
    email: undefined,
    phoneNumber: undefined,
    telegram: undefined,
    discord: undefined,
    slack: undefined,
    wallet: undefined,
  });

  const targetGroupToBeSaved: AlterTargetGroupParams = {
    name: 'Default',
    email:
      targetInputs.email.value === ''
        ? { type: 'remove' }
        : { type: 'ensure', name: targetInputs.email.value },
    phoneNumber: isValidPhoneNumber(targetInputs.phoneNumber.value)
      ? { type: 'ensure', name: targetInputs.phoneNumber.value }
      : { type: 'remove' },
    telegram: targetInputs.telegram
      ? { type: 'ensure', name: 'Default' }
      : { type: 'remove' },
    discord: targetInputs.discord
      ? { type: 'ensure', name: 'Default' }
      : { type: 'remove' },
    slack: targetInputs.slack
      ? { type: 'ensure', name: 'Default' }
      : { type: 'remove' },
    wallet: targetInputs.wallet
      ? { type: 'ensure', name: 'Default' }
      : { type: 'remove' },
  };

  const currentSubscription =
    React.useRef<ReturnType<NotifiFrontendClient['addEventListener']>>();

  useEffect(() => {
    // NOTE: Initial load
    if (frontendClientStatus.isAuthenticated && !isInitialLoaded.current) {
      if (isLoading && isInitialLoaded.current) return;
      isInitialLoaded.current = true;
      setIsLoading(true);
      frontendClient
        .fetchFusionData()
        .then((data) => {
          refreshTargetDocument(data);
        })
        .catch((e) => {
          isInitialLoaded.current = false;
          if (e instanceof Error) {
            setError({
              ...e,
              message: ` Initial load target data error (fetchFusionData): ${e.message}`,
            });
          }
          console.error(e);
        })
        .finally(() => setIsLoading(false));
    }

    // NOTE: Subscription for state change
    if (frontendClientStatus.isAuthenticated) {
      const targetChangedHandler = (evt: Types.StateChangedEvent) => {
        if (evt.__typename === 'TargetStateChangedEvent') {
          frontendClient.fetchFusionData().then(refreshTargetDocument);
        }
      };

      currentSubscription.current = frontendClient.addEventListener(
        'stateChanged',
        targetChangedHandler,
        (error) => {
          if (error instanceof Error) {
            setError({
              ...error,
              message: `NotifiTargetContext - stateChanged: ${error.message}`,
            });
          }
          console.error('NotifiTargetContext - stateChanged:', error);
        },
      );

      return () => {
        const id = currentSubscription.current;
        if (!id) return;
        frontendClient.removeEventListener('stateChanged', id);
        currentSubscription.current = undefined;
        setError(null);
      };
    }
  }, [frontendClientStatus.isAuthenticated]);

  useEffect(() => {
    if (targetData.email !== targetInputs.email.value) {
      setIsChangingTargets((prev) => ({ ...prev, email: true }));
    } else {
      setIsChangingTargets((prev) => ({ ...prev, email: false }));
    }
    if (targetData.telegram.useTelegram !== targetInputs.telegram) {
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
    if (targetData.wallet.useWallet !== targetInputs.wallet) {
      setIsChangingTargets((prev) => ({ ...prev, wallet: true }));
    } else {
      setIsChangingTargets((prev) => ({ ...prev, wallet: false }));
    }
  }, [targetInputs]);

  useEffect(() => {
    // NOTE: For dynamic re-rendering of the target availability (TargetInputToggles)
    setTargetData((prev) => ({
      ...prev,
      discord: {
        ...prev.discord,
        isAvailable: toggleTargetAvailability?.discord ?? true,
      },
      slack: {
        ...prev.slack,
        isAvailable: toggleTargetAvailability?.slack ?? true,
      },
      wallet: {
        ...prev.wallet,
        isAvailable: toggleTargetAvailability?.wallet ?? false,
      },
    }));
  }, [toggleTargetAvailability]);

  const unVerifiedTargets = useMemo(() => {
    const { email: emailInfoPrompt, phoneNumber: phoneNumberInfoPrompt } =
      targetInfoPrompts;

    const unConfirmedTargets = {
      email: emailInfoPrompt?.infoPrompt.type === 'cta',
      phoneNumber: phoneNumberInfoPrompt?.infoPrompt.type === 'cta',
      // TOGGLE TARGET will never be unverified (Unverified means the target is not confirmed)
      telegram: false,
      slack: false,
      wallet: false,
      discord: false,
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
      target: T extends 'form' ? FormTarget : ToggleTarget,
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

  const renewTargetGroup = useCallback(
    async (
      singleTargetRenewArgs?: TargetRenewArgs,
    ): Promise<Types.TargetGroupFragmentFragment | null> => {
      let data: AlterTargetGroupParams = { ...targetGroupToBeSaved };

      if (singleTargetRenewArgs) {
        data = {
          name: 'Default',
          email: !targetData.email
            ? { type: 'remove' }
            : { type: 'ensure', name: targetData.email },
          phoneNumber: !targetData.phoneNumber
            ? { type: 'remove' }
            : { type: 'ensure', name: targetData.phoneNumber },
          telegram: targetData.telegram.useTelegram
            ? { type: 'ensure', name: 'Default' }
            : { type: 'remove' },
          discord: targetData.discord.useDiscord
            ? { type: 'ensure', name: 'Default' }
            : { type: 'remove' },
          slack: targetData.slack.useSlack
            ? { type: 'ensure', name: 'Default' }
            : { type: 'remove' },
          wallet: targetData.wallet.useWallet
            ? { type: 'ensure', name: 'Default' }
            : { type: 'remove' },
        };

        const { target, value } = singleTargetRenewArgs;
        if (isFormTargetRenewArgs(singleTargetRenewArgs)) {
          let formValue: UpdateTargetsParam = { type: 'remove' };

          if (target === 'email') {
            formValue =
              value === ''
                ? { type: 'remove' }
                : { type: 'ensure', name: value };
          }

          if (target === 'phoneNumber') {
            formValue = isValidPhoneNumber(value)
              ? { type: 'ensure', name: value }
              : { type: 'remove' };
          }

          data = {
            ...data,
            [target]: formValue,
          };
        } else if (isToggleTargetRenewArgs(singleTargetRenewArgs)) {
          data = {
            ...data,
            [target]: value
              ? { type: 'ensure', name: 'Default' }
              : { type: 'remove' },
          };
        }
      }
      setIsLoading(true);
      return frontendClient
        .alterTargetGroup(data)
        .then((_result) => {
          frontendClient
            .fetchFusionData()
            .then((data) => {
              refreshTargetDocument(data);
              setError(null);
            })
            .catch((e) => setError(e as Error))
            .finally(() => setIsLoading(false));
          return _result;
        })
        .catch((e) => {
          setError(e as Error);
          return null;
        })
        .finally(() => setIsLoading(false));
    },
    [frontendClient, targetGroupToBeSaved, targetData],
  );

  // INTERNAL METHOD BELOW:
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

  const refreshTargetDocument = useCallback(
    (newData: Types.FetchFusionDataQuery) => {
      const targetGroup = newData.targetGroup?.find(
        (tg) => tg?.name === 'Default',
      );
      // Update target group Id
      setTargetGroupId(targetGroup?.id ?? null);

      // Update inputs state
      setTargetInputs((prev) => ({
        ...prev,
        email: {
          value:
            targetGroup?.emailTargets?.[0]?.emailAddress ?? prev.email.value,
        },
        phoneNumber: {
          value:
            targetGroup?.smsTargets?.[0]?.phoneNumber ?? prev.phoneNumber.value,
        },
        telegram: !!targetGroup?.telegramTargets?.find(
          (it) => it?.name === 'Default',
        ),
        discord: !!targetGroup?.discordTargets?.find(
          (it) => it?.name === 'Default',
        ),
        slack: !!targetGroup?.slackChannelTargets?.find(
          (it) => it?.name === 'Default',
        ),
        wallet: !!targetGroup?.web3Targets?.find(
          (it) => it?.name === 'Default',
        ),
      }));

      // Update target data (TargetData) & info prompts (TargetInfoPrompt)
      const emailTarget = targetGroup?.emailTargets?.[0];
      refreshEmailTarget(emailTarget);

      const smsTarget = targetGroup?.smsTargets?.[0];
      refreshSmsTarget(smsTarget);

      const telegramTarget = targetGroup?.telegramTargets?.find(
        (it) => it?.name === 'Default',
      );
      refreshTelegramTarget(telegramTarget);

      const discordTarget = targetGroup?.discordTargets?.find(
        (it) => it?.name === 'Default',
      );
      refreshDiscordTarget(discordTarget);

      const slackTarget = targetGroup?.slackChannelTargets?.find(
        (it) => it?.name === 'Default',
      );
      refreshSlackTarget(slackTarget);

      const web3Target = targetGroup?.web3Targets?.find(
        (it) => it?.name === 'Default',
      );
      refreshWeb3Target(web3Target);
    },
    [],
  );

  const refreshEmailTarget = useCallback(
    async (emailTarget?: Types.EmailTargetFragmentFragment) => {
      setTargetData((prev) => ({
        ...prev,
        email: emailTarget?.emailAddress ?? '',
      }));
      if (emailTarget) {
        switch (emailTarget.isConfirmed) {
          case true:
            updateTargetInfoPrompt('email', {
              type: 'message',
              message: 'Verified',
            });
            break;
          case false:
            updateTargetInfoPrompt('email', {
              type: 'cta',
              message: 'Resend Link',
              onClick: () =>
                frontendClient.sendEmailTargetVerification({
                  targetId: emailTarget.id,
                }),
            });
            break;
          default:
            updateTargetInfoPrompt('email', {
              type: 'error',
              message: 'ERROR: Unexpected email state',
            });
        }
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
      if (smsTarget?.phoneNumber) {
        switch (smsTarget.isConfirmed) {
          case true:
            updateTargetInfoPrompt('phoneNumber', {
              type: 'message',
              message: 'Verified',
            });
            break;
          case false:
            updateTargetInfoPrompt('phoneNumber', {
              type: 'error',
              message: 'Messages stopped',
            });
            break;
          default:
            updateTargetInfoPrompt('phoneNumber', {
              type: 'error',
              message: 'ERROR: Unexpected sms state',
            });
        }
      } else {
        updateTargetInfoPrompt('phoneNumber', null);
      }
    },
    [frontendClient],
  );

  const refreshTelegramTarget = useCallback(
    async (telegramTarget?: Types.TelegramTargetFragmentFragment) => {
      if (!!telegramTarget) {
        const infoPrompt: TargetInfoPrompt = telegramTarget.isConfirmed
          ? {
              type: 'message',
              message: 'Verified',
            }
          : {
              type: 'cta',
              message: 'Set Up',
              onClick: () =>
                window.open(telegramTarget.confirmationUrl, '_blank'),
            };
        updateTargetInfoPrompt('telegram', infoPrompt);
        return setTargetData((prev) => ({
          ...prev,
          telegram: {
            useTelegram: true,
            data: telegramTarget,
            isAvailable: toggleTargetAvailability?.telegram ?? true,
          },
        }));
      }
      setTargetData((prev) => ({
        ...prev,
        telegram: {
          useTelegram: false,
          isAvailable: toggleTargetAvailability?.telegram ?? true,
        },
      }));
      updateTargetInfoPrompt('telegram', null);
    },
    [],
  );

  const refreshDiscordTarget = useCallback(
    async (discordTarget?: Types.DiscordTargetFragmentFragment) => {
      if (!!discordTarget && !discordTarget.isConfirmed) {
        updateTargetInfoPrompt('discord', {
          type: 'cta',
          message: 'Set Up',
          onClick: () => window.open(discordTarget.verificationLink, '_blank'),
        });
        setTargetData((prev) => ({
          ...prev,
          discord: {
            useDiscord: true,
            data: discordTarget,
            isAvailable: toggleTargetAvailability?.discord ?? true,
          },
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
            updateTargetInfoPrompt('discord', {
              type: 'message',
              message: 'Verified',
            });
            break;
          default:
            updateTargetInfoPrompt('discord', {
              type: 'error',
              message: 'ERROR: Unexpected discord state',
            });
        }
        setTargetData((prev) => ({
          ...prev,
          discord: {
            useDiscord: true,
            data: discordTarget,
            isAvailable: toggleTargetAvailability?.discord ?? true,
          },
        }));
      } else {
        setTargetData((prev) => ({
          ...prev,
          discord: {
            useDiscord: false,
            isAvailable: toggleTargetAvailability?.discord ?? true,
          },
        }));
        updateTargetInfoPrompt('discord', null);
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
              message: 'Set Up',
              onClick: () =>
                window.open(slackTarget.verificationLink, '_blank'),
            });
            break;
          case 'VERIFIED':
            updateTargetInfoPrompt('slack', {
              type: 'message',
              message: 'Verified',
            });
            break;
          default:
            updateTargetInfoPrompt('slack', {
              type: 'error',
              message: 'ERROR: Unexpected slack state',
            });
        }
        setTargetData((prev) => ({
          ...prev,
          slack: {
            useSlack: true,
            data: slackTarget,
            isAvailable: toggleTargetAvailability?.slack ?? true,
          },
        }));
      } else {
        setTargetData((prev) => ({
          ...prev,
          slack: {
            useSlack: false,
            isAvailable: toggleTargetAvailability?.slack ?? true,
          },
        }));
        updateTargetInfoPrompt('slack', null);
      }
    },
    [],
  );

  const refreshWeb3Target = useCallback(
    async (web3Target?: Types.Web3TargetFragmentFragment) => {
      if (web3Target) {
        switch (web3Target.isConfirmed) {
          case false:
            updateTargetInfoPrompt('wallet', {
              type: 'cta',
              message: 'Sign Wallet',
              onClick: async () => {
                // NOTE: sign coinbase requires up to 3 signing process: 1. init XMTP, 2. create XMTP conversation, 3. sign the confirm message to Notifi BE
                if (!web3Target.senderAddress) {
                  setError(
                    new Error(
                      'ERROR: Missing sender address, please try again',
                    ),
                  );
                  return;
                }
                const updatedWeb3Target =
                  await plugin?.walletTarget.signCoinbaseSignature(
                    frontendClient,
                    web3Target.id,
                    web3Target.senderAddress,
                  );
                if (!updatedWeb3Target) return;
                refreshWeb3Target(updatedWeb3Target);
              },
            });
            break;
          case true:
            updateTargetInfoPrompt('wallet', {
              type: 'message',
              message: 'Verified',
            });
            break;
          default:
            updateTargetInfoPrompt('wallet', {
              type: 'error',
              message: 'ERROR: Unexpected wallet state',
            });
        }
        setTargetData((prev) => ({
          ...prev,
          wallet: {
            useWallet: true,
            data: web3Target,
            isAvailable: toggleTargetAvailability?.wallet ?? false,
          },
        }));
      } else {
        setTargetData((prev) => ({
          ...prev,
          wallet: {
            useWallet: false,
            isAvailable: toggleTargetAvailability?.wallet ?? false,
          },
        }));
        updateTargetInfoPrompt('wallet', null);
      }
    },
    [toggleTargetAvailability, plugin],
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
        plugin,
      }}
    >
      {children}
    </NotifiTargetContext.Provider>
  );
};

export const useNotifiTargetContext = () => useContext(NotifiTargetContext);
