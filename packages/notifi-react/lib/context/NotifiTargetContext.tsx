import { objectKeys } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { useClient } from '@xmtp/react-sdk';
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

import { reformatSignatureForWalletTarget } from '../utils/wallet';
import { createCoinbaseNonce, subscribeCoinbaseMessaging } from '../utils/xmtp';
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

export type Target =
  | 'email'
  | 'phoneNumber'
  | 'telegram'
  | 'discord'
  | 'slack'
  | 'wallet';

export type FormTarget = Extract<Target, 'email' | 'phoneNumber' | 'telegram'>;
export type ToggleTarget = Extract<Target, 'discord' | 'slack' | 'wallet'>;

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
  telegram: string;
  discord: { useDiscord: boolean; data?: Types.DiscordTargetFragmentFragment };
  slack: { useSlack: boolean; data?: Types.SlackChannelTargetFragmentFragment }; // TODO: Add back slack after merging
  wallet: { useWallet: boolean; data?: Types.Web3TargetFragmentFragment };
};

const formatTelegramForSubscription = (telegramId: string) => {
  if (telegramId.startsWith('@')) {
    return telegramId.slice(1);
  }
  return telegramId;
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
  return (
    args.target === 'email' ||
    args.target === 'telegram' ||
    args.target === 'phoneNumber'
  );
};

const isToggleTargetRenewArgs = (
  args: TargetRenewArgs,
): args is ToggleTargetRenewArgs => {
  return (
    args.target === 'slack' ||
    args.target === 'wallet' ||
    args.target === 'discord'
  );
};

export type NotifiTargetContextType = {
  isLoading: boolean;
  error: Error | null;
  updateTargetInputs: UpdateTargetInputs;
  renewTargetGroup: (singleTargetRenewArgs?: {
    target: ToggleTarget;
    value: boolean;
  }) => Promise<void>;
  isChangingTargets: Record<Target, boolean>;
  targetDocument: TargetDocument;
  unVerifiedTargets: Target[];
  refreshTargetDocument: (newData: Types.FetchDataQuery) => void;
};

let web3TargetId = '';
let senderAddress = '';

const NotifiTargetContext = createContext<NotifiTargetContextType>(
  {} as NotifiTargetContextType, // intentionally empty as initial value
);

export const NotifiTargetContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { frontendClient, frontendClientStatus, walletWithSignParams } =
    useNotifiFrontendClientContext();
  const xmtp = useClient();

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoaded = React.useRef(false);
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
  const [targetInputs, setTargetInputs] = useState<TargetInputs>({
    email: { value: '', error: '' },
    phoneNumber: { value: '', error: '' },
    telegram: { value: '', error: '' },
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
    telegram: '',
    discord: { useDiscord: false },
    slack: { useSlack: false },
    wallet: { useWallet: false },
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
    walletId: targetInputs.wallet ? 'Default' : undefined,
  };
  web3TargetId = targetData?.wallet?.data?.id ?? '';

  // Note: This is tenant-specific. For now, we're supporting GMX only.
  // In the near future, we should retrieve this from the web3 target: targetData.wallet.data.senderAddress
  senderAddress = '0xE80E42B5308d5b137FC137302d571B56907c3003';

  useEffect(() => {
    //NOTE: target change listener when window is refocused
    const handler = () => {
      if (!frontendClientStatus.isAuthenticated) return;
      return frontendClient.fetchData().then(refreshTargetDocument);
    };
    window.addEventListener('focus', handler);

    // NOTE: Initial load
    if (frontendClientStatus.isAuthenticated && !isInitialLoaded.current) {
      if (isLoading && isInitialLoaded.current) return;
      isInitialLoaded.current = true;
      setIsLoading(true);
      frontendClient
        .fetchData()
        .then((data) => {
          refreshTargetDocument(data);
        })
        .finally(() => setIsLoading(false)); // TODO: handle error
    }

    return () => {
      window.removeEventListener('focus', handler);
    };
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
    if (targetData.wallet.useWallet !== targetInputs.wallet) {
      setIsChangingTargets((prev) => ({ ...prev, wallet: true }));
    } else {
      setIsChangingTargets((prev) => ({ ...prev, wallet: false }));
    }
  }, [targetInputs]);

  const unVerifiedTargets = useMemo(() => {
    const {
      email: emailInfoPrompt,
      phoneNumber: phoneNumberInfoPrompt,
      telegram: telegramInfoPrompt,
      discord: discordInfoPrompt,
      wallet: walletInfoPrompt,
    } = targetInfoPrompts;

    const unConfirmedTargets = {
      email: emailInfoPrompt?.infoPrompt.type === 'cta',
      phoneNumber: phoneNumberInfoPrompt?.infoPrompt.type === 'cta',
      telegram: telegramInfoPrompt?.infoPrompt.type === 'cta',
      slack:
        targetData.slack.useSlack &&
        discordInfoPrompt?.infoPrompt.type === 'cta' &&
        discordInfoPrompt?.infoPrompt.message === 'Enable Bot',
      wallet:
        targetData.wallet.useWallet &&
        walletInfoPrompt?.infoPrompt.type === 'cta' &&
        walletInfoPrompt?.infoPrompt.message === 'Sign Wallet',
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
    async (singleTargetRenewArgs?: TargetRenewArgs) => {
      let data = { ...targetGroupToBeSaved };

      if (singleTargetRenewArgs) {
        data = {
          name: 'Default',
          emailAddress: !targetData.email ? undefined : targetData.email,
          phoneNumber: !targetData.phoneNumber
            ? undefined
            : targetData.phoneNumber,
          telegramId: !targetData.telegram ? undefined : targetData.telegram,
          discordId: targetData.discord.useDiscord ? 'Default' : undefined,
          slackId: targetData.slack.useSlack ? 'Default' : undefined,
          walletId: targetData.wallet.useWallet ? 'Default' : undefined,
        };

        const { target, value } = singleTargetRenewArgs;
        if (isFormTargetRenewArgs(singleTargetRenewArgs)) {
          let formTarget: string | undefined = '';
          let formValue: string | undefined = '';

          if (target === 'email') {
            formTarget = 'emailAddress';
            formValue = value === '' ? undefined : value;
          }

          if (target === 'telegram') {
            formTarget = 'telegramId';
            formValue =
              value === '' ? undefined : formatTelegramForSubscription(value);
          }

          if (target === 'phoneNumber') {
            formTarget = target;
            formValue = isValidPhoneNumber(value) ? value : undefined;
          }

          data = {
            ...data,
            [formTarget]: formValue,
          };
        } else if (isToggleTargetRenewArgs(singleTargetRenewArgs)) {
          data = {
            ...data,
            [`${target}Id`]: value ? 'Default' : undefined,
          };
        }
      }

      setIsLoading(true);
      return frontendClient
        .ensureTargetGroup(data)
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
    },
    [frontendClient, targetGroupToBeSaved, targetData],
  );

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
      wallet: !!targetGroup?.web3Targets?.find((it) => it?.name === 'Default'),
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

    const web3Target = targetGroup?.web3Targets?.find(
      (it) => it?.name === 'Default',
    );
    refreshWeb3Target(web3Target);
  }, []);

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
        updateTargetInfoPrompt('email', {
          type: 'message',
          message: 'Verified',
        });
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
      setTargetData((prev) => ({
        ...prev,
        telegram: telegramTarget?.telegramId ?? '',
      }));
      if (telegramTarget) {
        switch (telegramTarget.isConfirmed) {
          case true:
            updateTargetInfoPrompt('telegram', {
              type: 'message',
              message: 'Verified',
            });
            break;
          case false:
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
            break;
          default:
            updateTargetInfoPrompt('telegram', {
              type: 'error',
              message: 'ERROR: Unexpected telegram state',
            });
        }
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

  const getSignature = useCallback(
    async (message: Uint8Array | string) => {
      let signature: Uint8Array | string = '';

      if (typeof message === 'string') {
        const encoder = new TextEncoder();
        message = encoder.encode(message);
      }

      // TODO: Add logic for rest of the chains
      switch (walletWithSignParams.walletBlockchain) {
        case 'AVALANCHE':
        case 'ETHEREUM':
        case 'POLYGON':
        case 'ARBITRUM':
        case 'BINANCE':
        case 'ELYS':
        case 'NEUTRON':
        case 'ARCHWAY':
        case 'AXELAR':
        case 'BERACHAIN':
        case 'OPTIMISM':
        case 'ZKSYNC':
        case 'INJECTIVE':
        case 'BASE':
        case 'BLAST':
        case 'CELO':
        case 'MANTLE':
        case 'LINEA':
        case 'SCROLL':
        case 'MANTA':
        case 'EVMOS':
        case 'MONAD':
        case 'AGORIC':
        case 'ORAI':
        case 'KAVA':
        case 'CELESTIA':
        case 'COSMOS':
        case 'DYMENSION':
        case 'DYDX':
        case 'XION':
        case 'NEAR':
        case 'SUI':
          signature = await walletWithSignParams.signMessage(message);
          break;
        default: {
          setError(Error('This chain is not supported'));
          throw Error('This chain is not supported');
        }
      }
      return reformatSignatureForWalletTarget(signature);
    },
    [walletWithSignParams.signMessage],
  );

  // NOTE: Temporarily commenting out this function because it will be needed later
  // const xip43Impl = async () => {

  //   const targetId = targetData?.wallet?.data?.id ?? '';
  //   const address = '';

  //   const timestamp = Date.now();
  //   const message = createConsentMessage(senderAddress, timestamp);
  //   const signature = '';

  //   if (!signature) {
  //     throw Error('Unable to sign the wallet. Please try again.');
  //   }

  //   await frontendClient.verifyXmtpTarget({
  //     input: {
  //       web3TargetId: targetId,
  //       accountId: address,
  //       consentProofSignature: signature as string,
  //       timestamp: timestamp,
  //       isCBW: true,
  //     },
  //   });
  //   // await signCoinbaseSignature(address, senderAddress);
  //   await frontendClient.verifyCbwTarget({
  //     input: {
  //       targetId: targetId,
  //     },
  //   });
  // };

  const xmtpXip42Impl = useCallback(async () => {
    const options: any = {
      persistConversations: false,
      env: 'production',
    };
    const address = walletWithSignParams.walletPublicKey;

    const signer = {
      getAddress: (): Promise<string> => {
        return new Promise((resolve) => {
          resolve(address);
        });
      },
      signMessage: async (message: Uint8Array | string): Promise<string> => {
        return getSignature(message);
      },
    };

    const client = await xmtp.initialize({ options, signer });

    if (client === undefined) {
      throw Error('XMTP client is uninitialized. Please try again.');
    }

    const conversation = await client.conversations.newConversation(
      senderAddress,
    );

    await client.contacts.allow([senderAddress]);

    return conversation.topic.split('/')[3];
  }, [walletWithSignParams.walletPublicKey, xmtp, getSignature]);

  const signCoinbaseSignature = useCallback(async () => {
    try {
      const conversationTopic = await xmtpXip42Impl();
      const address = walletWithSignParams.walletPublicKey;

      const nonce = await createCoinbaseNonce();
      if (!nonce) throw Error('Unable to sign the wallet. Please try again.');

      const message = `Coinbase Wallet Messaging subscribe\nAddress: ${address}\nPartner Address: ${senderAddress}\nNonce: ${nonce}`;

      const signature = await getSignature(message);

      if (!signature)
        throw Error('Unable to sign the wallet. Please try again.');

      const payload = {
        address,
        nonce,
        signature: signature as `0x${string}`,
        isActivatedViaCb: true,
        partnerAddress: senderAddress,
        conversationTopic,
      };

      await subscribeCoinbaseMessaging(payload);

      await frontendClient.verifyXmtpTargetViaXip42({
        input: {
          web3TargetId,
          accountId: address,
          conversationTopic,
        },
      });

      await frontendClient
        .fetchData()
        .then(refreshTargetDocument)
        .catch((e: unknown) => console.error(e));

      return true;
    } catch (e) {
      return false;
    }
  }, [
    walletWithSignParams.walletPublicKey,
    frontendClient,
    xmtpXip42Impl,
    getSignature,
  ]);

  const signWallet = useCallback(async () => {
    // TODO: Add logic to handle different wallet signatures
    return await signCoinbaseSignature();
  }, [signCoinbaseSignature]);

  const refreshWeb3Target = useCallback(
    async (web3Target?: Types.Web3TargetFragmentFragment) => {
      if (web3Target) {
        switch (web3Target.isConfirmed) {
          case false:
            updateTargetInfoPrompt('wallet', {
              type: 'cta',
              message: 'Sign Wallet',
              onClick: () => {
                return signWallet();
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
          wallet: { useWallet: true, data: web3Target },
        }));
      } else {
        setTargetData((prev) => ({
          ...prev,
          wallet: { useWallet: false },
        }));
      }
    },
    [signWallet],
  );

  return (
    <NotifiTargetContext.Provider
      value={{
        refreshTargetDocument,
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
