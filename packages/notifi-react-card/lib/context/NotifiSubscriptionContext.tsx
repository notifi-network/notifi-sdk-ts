import "./polyfills";
import { Types } from '@notifi-network/notifi-graphql';
import { Client, useClient, useConsent, Signer, XMTPProvider } from "@xmtp/react-sdk";
import { PropsWithChildren, useMemo } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  FetchedCardViewState,
  SubscriptionData,
  useFetchedCardState,
} from '../hooks';
import {
  IntercomCardView,
  useIntercomCardState,
} from '../hooks/useIntercomCardState';
import { prefixTelegramWithSymbol } from '../utils/stringUtils';
import { useNotifiClientContext } from './NotifiClientContext';
import { NotifiParams, EthereumParams } from './NotifiContext';
import { useNotifiForm } from './NotifiFormContext';
import {
  DestinationError,
  DestinationErrorMessageField,
  DestinationErrors,
} from './constants';

export type DestinationErrorMessages = DestinationErrors;

declare global {
  interface Window {
    CBWSubscribe: any;
  }
}

export enum FtuStage {
  Destination = 3,
  Alerts = 2,
  Done = 1,
}

export type NotifiSubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Types.AlertFragmentFragment | undefined>>;
  connectedWallets: ReadonlyArray<Types.ConnectedWalletFragmentFragment>;
  setConnectedWallets: React.Dispatch<
    React.SetStateAction<ReadonlyArray<Types.ConnectedWalletFragmentFragment>>
  >;
  destinationErrorMessages: DestinationErrorMessages;
  email: string;
  params: NotifiParams;
  phoneNumber: string;
  telegramId: string;
  telegramConfirmationUrl?: string;
  useHardwareWallet: boolean;
  useDiscord: boolean;
  useSlack: boolean;
  useWeb3: boolean;
  /**
   * @deprecated Now this context can be consumed as long as the component is wrapped in NotifiContext
   */
  contextId: string;
  cardView: FetchedCardViewState;
  setCardView: React.Dispatch<React.SetStateAction<FetchedCardViewState>>;
  intercomCardView: IntercomCardView;
  setIntercomCardView: React.Dispatch<React.SetStateAction<IntercomCardView>>;
  setAlerts: (
    alerts: Record<string, Types.AlertFragmentFragment | undefined>,
  ) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setTelegramId: (telegramId: string) => void;
  setUseHardwareWallet: React.Dispatch<React.SetStateAction<boolean>>;
  setUseDiscord: React.Dispatch<React.SetStateAction<boolean>>;
  setUseSlack: React.Dispatch<React.SetStateAction<boolean>>;
  setUseWeb3: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hasChatAlert: boolean;
  setHasChatAlert: (hasChatAlert: boolean) => void;
  conversationId: string;
  setConversationId: (conversationId: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  setEmailErrorMessage: (value: DestinationError) => void;
  setTelegramConfirmationUrl: (
    telegramConfirmationUrl: string | undefined,
  ) => void;
  setPhoneNumberErrorMessage: (value: DestinationError) => void;
  setDiscordErrorMessage: (value: DestinationError) => void;
  setSlackErrorMessage: (value: DestinationError) => void;
  setTelegramErrorMessage: (value: DestinationError) => void;
  resetErrorMessageState: () => void;

  discordTargetData: Types.DiscordTargetFragmentFragment | undefined;
  setDiscordTargetData: React.Dispatch<
    React.SetStateAction<Types.DiscordTargetFragmentFragment | undefined>
  >;

  web3TargetData: Types.Web3TargetFragmentFragment | undefined;
  setWeb3TargetData: React.Dispatch<
    React.SetStateAction<Types.Web3TargetFragmentFragment | undefined>
  >

  slackTargetData: Types.SlackChannelTargetFragmentFragment | undefined;
  setSlackTargetData: React.Dispatch<
    React.SetStateAction<Types.SlackChannelTargetFragmentFragment | undefined>
  >;

  ftuStage: FtuStage | null;
  syncFtuStage: (isContactInfoRequired?: boolean) => Promise<void>;
  updateFtuStage: (ftuConfigStep: FtuStage) => Promise<void>;
  render: (newData: Types.FetchDataQuery) => SubscriptionData;
}>;

const NotifiSubscriptionContext = createContext<NotifiSubscriptionData>(
  {} as unknown as NotifiSubscriptionData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

const hasKey = <K extends string>(
  obj: object,
  key: K,
): obj is object & { [k in K]: unknown } => {
  return typeof obj === 'object' && obj !== null && key in obj;
};

export const NotifiSubscriptionContextProvider: React.FC<
  PropsWithChildren<NotifiParams>
> = ({ children, ...params }) => {
  const { frontendClient, isUsingFrontendClient } = useNotifiClientContext();

  const { client, error, isLoading, initialize } = useClient();
  const { allow, isAllowed } = useConsent();

  const contextId = useMemo(() => {
    return new Date().toISOString();
  }, []);

  const [conversationId, setConversationId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const [hasChatAlert, setHasChatAlert] = useState<boolean>(false);
  const { cardView, setCardView } = useFetchedCardState();
  const { intercomCardView, setIntercomCardView } = useIntercomCardState();

  const [telegramConfirmationUrl, setTelegramConfirmationUrl] = useState<
    string | undefined
  >(undefined);

  const [alerts, setAlerts] = useState<
    Record<string, Types.AlertFragmentFragment | undefined>
  >({});
  const [connectedWallets, setConnectedWallets] = useState<
    ReadonlyArray<Types.ConnectedWalletFragmentFragment>
  >([]);
  const [useHardwareWallet, setUseHardwareWallet] = useState<boolean>(false);
  const [useDiscord, setUseDiscord] = useState<boolean>(false);
  const [useSlack, setUseSlack] = useState<boolean>(false);
  const [useWeb3, setUseWeb3] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [telegramId, setTelegramId] = useState<string>('');
  const [ftuStage, setFtuStage] = useState<FtuStage | null>(null);

  const [discordTargetData, setDiscordTargetData] = useState<
    Types.DiscordTargetFragmentFragment | undefined
  >(undefined);

  const [web3TargetData, setWeb3TargetData] = useState<
    Types.Web3TargetFragmentFragment | undefined
  >(undefined);

  const [slackTargetData, setSlackTargetData] = useState<
    Types.SlackChannelTargetFragmentFragment | undefined
  >(undefined);

  const [destinationErrorMessages, setDestinationErrorMessages] =
    useState<DestinationErrorMessages>({
      email: undefined,
      telegram: undefined,
      phoneNumber: undefined,
      discord: undefined,
      slack: undefined,
      web3: undefined,
    });

  const handleErrorMessage = ({
    field,
    value,
  }: DestinationErrorMessageField) => {
    setDestinationErrorMessages((destinationErrorMessages) => ({
      ...destinationErrorMessages,
      [field]: value,
    }));
  };

  const setEmailErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'email', value });
  };

  const setTelegramErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'telegram', value });
  };

  const setPhoneNumberErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'phoneNumber', value });
  };
  const setDiscordErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'discord', value });
  };

  const setWeb3ErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'web3', value });
  };

  const setSlackErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'slack', value });
  };

  const resetErrorMessageState = () => {
    setDestinationErrorMessages({
      email: undefined,
      telegram: undefined,
      phoneNumber: undefined,
      discord: undefined,
      slack: undefined,
      web3: undefined,
    });
  };

  const syncFtuStage = useCallback(
    async (isContactInfoRequired?: boolean) => {
      const userSettings = await frontendClient.getUserSettings();
      if (!userSettings?.ftuStage) {
        if (isContactInfoRequired) {
          return await updateFtuStage(FtuStage.Destination);
        }
        return await updateFtuStage(FtuStage.Alerts);
      }
      setFtuStage(userSettings.ftuStage);
    },
    [frontendClient?.userState?.status],
  );

  const updateFtuStage = useCallback(
    async (ftuConfigStep: FtuStage) => {
      await frontendClient.updateUserSettings({
        input: { ftuStage: ftuConfigStep },
      });
      setFtuStage(ftuConfigStep);
    },
    [frontendClient?.userState?.status],
  );

  const {
    setEmail: setFormEmail,
    setTelegram: setFormTelegram,
    setPhoneNumber: setFormPhoneNumber,
  } = useNotifiForm();

  const didFetch = React.useRef(false);

  useEffect(() => {
    // Initial fetch data
    if (
      !didFetch.current &&
      frontendClient.userState?.status === 'authenticated' &&
      isUsingFrontendClient
    ) {
      frontendClient
        .fetchData()
        .then((data) => {
          render(data);
          copyAuths(data);
        })
        .catch((_e) => {
          /* Intentionally empty */
        })
        .finally(() => {
          didFetch.current = true;
        });
    }
  }, [frontendClient.userState]);

  const copyAuths = useCallback(
    async (data: Types.FetchDataQuery) => {
      if (params.multiWallet !== undefined) {
        params.multiWallet.ownedWallets.forEach((wallet) => {
          const key = 'accountAddress';
          const address = hasKey(wallet, key)
            ? wallet[key]
            : wallet.walletPublicKey;
          if (
            data.connectedWallet?.find(
              (cw) =>
                cw?.address === address &&
                cw?.walletBlockchain === wallet.walletBlockchain,
            ) !== undefined
          ) {
            frontendClient
              .copyAuthorization({
                walletBlockchain: 'SOLANA',
                walletPublicKey: wallet.walletPublicKey,
                env: params.env,
                tenantId: params.dappAddress,
                storageOption: { driverType: 'LocalForage' },
              })
              .catch(console.log);
          }
        });
      }
    },
    [frontendClient, params],
  );

  const [isSubscribed, setISubscribed] = useState<boolean>(false);
  const [isCbwLoading, setIsCbwLoading] = useState<boolean>(true);

  const normalizeHexString = (input: string): string => {
    let result = input;
    if (input !== '') {
      result = input.toLowerCase();
      if (!result.startsWith('0x')) {
        result = '0x' + result;
      }
    }
    return result;
  };

  const handleXmtp = useCallback(async () => {
    console.log('xmtp')
    var signer = {
      getAddress: async (): Promise<string> => {
        await new Promise((resolve, reject) => { });
        return params.walletPublicKey;
      },
      signMessage: async (message: string): Promise<string> => {
        const messageBuffer = new TextEncoder().encode(
          message,
        );
        const signedBuffer = await (params as EthereumParams).signMessage(messageBuffer);
        const signature = normalizeHexString(
          Buffer.from(signedBuffer).toString('hex'),
        );
        return signature;
      }
    };

    console.log('xmtp2')
    const options: any = {
      persistConversations: false,
      env: "production",
    };

    console.log('xmtp3')
    const keys = await Client.getKeys(signer, {
      ...options,
      skipContactPublishing: true,
      persistConversations: false,
    });

    console.log('xmtp4')
    await initialize({ keys, options, signer });
  }, [initialize]);

  const handleSubscribe = useCallback(() => {
    if (window.CBWSubscribe) {
      window.CBWSubscribe.toggleSubscription();
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = "https://broadcast.coinbase.com/subscribe-button.js";
    script.async = true;

    document.body.appendChild(script);

    if (window.CBWSubscribe?.createSubscriptionUI) {
      window.CBWSubscribe.createSubscriptionUI({
        // Address user will be subscrizbing to.
        partnerAddress: '0xb49bbE2c31CF4a0fB74b16812b8c6B6FeEE23524',
        partnerName: 'Test Notification',
        // Title for subscribe modal. See pictures below.
        modalTitle: '[Title of the subscription modal that pops up after a user clicks subscribe]',
        // Description title for the subscribe modal. See pictures below.
        modalBody: '[Informative blurb telling visitors why the should subscribe]',
        onSubscriptionChange: setISubscribed,
        onLoading: setIsCbwLoading,
      });
    }

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const render = useCallback(
    (newData: Types.FetchDataQuery): SubscriptionData => {
      const targetGroup = newData.targetGroup?.find(
        (tg) => tg?.name === 'Default',
      );
      const alerts: Record<string, Types.AlertFragmentFragment> = {};
      newData.alert?.forEach((alert) => {
        if (alert?.name) {
          alerts[alert.name] = alert;
        }
      });
      setAlerts(alerts);

      setConnectedWallets(
        newData.connectedWallet?.filter(
          (wallet): wallet is Types.ConnectedWalletFragmentFragment => !!wallet,
        ) ?? [],
      );
      const emailTarget = targetGroup?.emailTargets?.[0] ?? null;
      const emailToSet = emailTarget?.emailAddress ?? '';

      if (!!emailTarget && !emailTarget.isConfirmed) {
        setEmailErrorMessage({
          type: 'recoverableError',
          onClick: () =>
            frontendClient.sendEmailTargetVerification({
              targetId: emailTarget.id,
            }),
          message: 'Resend Link',
        });
      } else {
        setEmailErrorMessage(undefined);
      }
      setEmail(emailToSet);
      setFormEmail(emailToSet);

      const phoneNumber = targetGroup?.smsTargets?.[0]?.phoneNumber ?? null;
      const isPhoneNumberConfirmed =
        targetGroup?.smsTargets?.[0]?.isConfirmed ?? false;
      const phoneNumberToSet = phoneNumber ?? '';

      if (!!phoneNumber && !isPhoneNumberConfirmed) {
        setPhoneNumberErrorMessage({
          type: 'unrecoverableError',
          message: 'Messages stopped',
          tooltip: `Please text 'start' to the following number:\n${params.env === 'Production' ? '+1 206 222 3465' : '+1 253 880 1477 '
            }`,
        });
      }

      setFormPhoneNumber(phoneNumberToSet || '');
      setPhoneNumber(phoneNumberToSet || '');

      const telegramTarget = targetGroup?.telegramTargets?.[0] ?? null;
      const telegramId = telegramTarget?.telegramId;

      const telegramIdWithSymbolAdded =
        telegramId !== '' && telegramId?.length
          ? prefixTelegramWithSymbol(telegramId)
          : null;

      setFormTelegram(telegramId ?? '');
      setTelegramId(telegramIdWithSymbolAdded ?? '');

      if (!!telegramTarget && !telegramTarget?.isConfirmed) {
        setTelegramErrorMessage({
          type: 'recoverableError',
          onClick: () => {
            if (!telegramTarget?.confirmationUrl) {
              return;
            }

            window.open(telegramTarget?.confirmationUrl);
          },
          message: 'Verify ID',
        });
      } else {
        setTelegramErrorMessage(undefined);
      }

      const discordTarget = targetGroup?.discordTargets?.find(
        (it) => it?.name === 'Default',
      );

      if (!!discordTarget && !discordTarget.isConfirmed) {
        setDiscordErrorMessage({
          type: 'recoverableError',
          onClick: () => window.open(discordTarget.verificationLink, '_blank'),
          message: 'Enable Bot',
        });
        setUseDiscord(true);
        setDiscordTargetData(discordTarget);
      } else if (!!discordTarget && discordTarget.isConfirmed) {
        switch (discordTarget.userStatus) {
          case 'DISCORD_SERVER_NOT_JOINED':
            setDiscordErrorMessage({
              type: 'recoverableError',
              onClick: () =>
                window.open(discordTarget.discordServerInviteLink, '_blank'),
              message: 'Join Server',
            });
            break;
          case 'COMPLETE':
            setDiscordErrorMessage(undefined);
            break;
          default: // UNVERIFIED: Should never get in this state
            throw new Error('Discord target in unexpected state');
        }
        setUseDiscord(true);
        setDiscordTargetData(discordTarget);
      } else {
        setDiscordTargetData(undefined);
        setUseDiscord(false);
      }

      const web3Target = targetGroup?.web3Targets?.find(
        (it) => it?.name === 'Default',
      );

      if (!!web3Target && !web3Target.isConfirmed) {
        setWeb3ErrorMessage({
          type: 'recoverableError',
          onClick: async () => {
            console.log(web3Target.id)
            console.log(params.walletPublicKey);

            try {
              handleSubscribe();
              frontendClient.verifyWeb3Target({ targetId: web3Target.id ?? '', walletAddress: params.walletPublicKey })
              console.log('successfully verified web3 target')
            }
            catch (e) {
              console.error("failed to sign")
              console.error(e)
            }

          },
          message: 'Sign Wallet',
        });
        setUseWeb3(true);
        setWeb3TargetData(web3Target);
      } else if (!!web3Target && web3Target.isConfirmed) {
        setUseWeb3(true);
        setWeb3TargetData(web3Target);
      } else {
        setWeb3TargetData(undefined);
        setUseWeb3(false);
      }

      const slackTarget = targetGroup?.slackChannelTargets?.find(
        (it) => it?.name === 'Default',
      );

      if (slackTarget) {
        switch (slackTarget.verificationStatus) {
          case 'UNVERIFIED':
          case 'MISSING_PERMISSIONS':
          case 'MISSING_CHANNEL':
            setSlackErrorMessage({
              type: 'recoverableError',
              onClick: () =>
                window.open(slackTarget.verificationLink, '_blank'),
              message: 'Enable Bot',
            });
            break;
          case 'VERIFIED':
            setSlackErrorMessage(undefined);
            break;
          default:
            throw new Error('Slack target in unexpected state');
        }
        setUseSlack(true);
        setSlackTargetData(slackTarget);
      } else {
        setSlackTargetData(undefined);
        setUseSlack(false);
      }

      return {
        alerts,
        email: emailTarget?.emailAddress ?? null,
        isPhoneNumberConfirmed,
        phoneNumber,
        telegramConfirmationUrl: telegramTarget?.confirmationUrl ?? null,
        telegramId: telegramTarget?.telegramId ?? null,
        discordId: discordTarget?.id ?? null,
        slackId: slackTarget?.id ?? null,
      };
    },
    [setAlerts, setEmail, setPhoneNumber, setTelegramId],
  );

  const value = {
    alerts,
    connectedWallets,
    email,
    loading,
    params,
    phoneNumber,
    contextId,
    telegramId,
    cardView,
    telegramConfirmationUrl,
    useHardwareWallet,
    destinationErrorMessages,
    setAlerts,
    setConnectedWallets,
    setCardView,
    setEmail,
    setLoading,
    setPhoneNumber,
    setTelegramId,
    setTelegramConfirmationUrl,
    setUseHardwareWallet,
    intercomCardView,
    setIntercomCardView,
    hasChatAlert,
    setHasChatAlert,
    conversationId,
    setConversationId,
    userId,
    setUserId,
    setEmailErrorMessage,
    setTelegramErrorMessage,
    setPhoneNumberErrorMessage,
    resetErrorMessageState,
    setDiscordErrorMessage,
    setSlackErrorMessage,
    useDiscord,
    useSlack,
    setUseDiscord,
    setUseSlack,
    useWeb3,
    setUseWeb3,
    web3TargetData,
    setWeb3TargetData,
    setWeb3ErrorMessage,
    discordTargetData,
    setDiscordTargetData,
    slackTargetData,
    setSlackTargetData,
    render,
    ftuStage,
    syncFtuStage,
    updateFtuStage,
  };

  return (
    <XMTPProvider>

      <NotifiSubscriptionContext.Provider value={value}>
        {children}
      </NotifiSubscriptionContext.Provider>
    </XMTPProvider>
  );
};

export const useNotifiSubscriptionContext: () => NotifiSubscriptionData =
  () => {
    const data = useContext(NotifiSubscriptionContext);
    return data;
  };
