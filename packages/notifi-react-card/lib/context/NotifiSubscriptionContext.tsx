import {
  Alert,
  ConnectedWallet,
  DiscordTarget,
  DiscordTargetStatus,
} from '@notifi-network/notifi-core';
import { Types } from '@notifi-network/notifi-graphql';
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
import { DISCORD_INVITE_URL } from '../utils/constants';
import { prefixTelegramWithSymbol } from '../utils/stringUtils';
import { useNotifiClientContext } from './NotifiClientContext';
import { NotifiParams } from './NotifiContext';
import { useNotifiForm } from './NotifiFormContext';
import {
  DestinationError,
  DestinationErrorMessageField,
  DestinationErrors,
} from './constants';

export type DestinationErrorMessages = DestinationErrors;

export type NotifiSubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert | undefined>>;
  connectedWallets: ReadonlyArray<ConnectedWallet>;
  setConnectedWallets: React.Dispatch<
    React.SetStateAction<ReadonlyArray<ConnectedWallet>>
  >;
  destinationErrorMessages: DestinationErrorMessages;
  email: string;
  params: NotifiParams;
  phoneNumber: string;
  telegramId: string;
  telegramConfirmationUrl?: string;
  useHardwareWallet: boolean;
  useDiscord: boolean;
  /**
   * @deprecated Now this context can be consumed as long as the component is wrapped in NotifiContext
   */
  contextId: string;
  cardView: FetchedCardViewState;
  setCardView: React.Dispatch<React.SetStateAction<FetchedCardViewState>>;
  intercomCardView: IntercomCardView;
  setIntercomCardView: React.Dispatch<React.SetStateAction<IntercomCardView>>;
  setAlerts: (alerts: Record<string, Alert | undefined>) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setTelegramId: (telegramId: string) => void;
  setUseHardwareWallet: React.Dispatch<React.SetStateAction<boolean>>;
  setUseDiscord: React.Dispatch<React.SetStateAction<boolean>>;
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
  setTelegramErrorMessage: (value: DestinationError) => void;
  resetErrorMessageState: () => void;

  discordTargetData: DiscordTarget | undefined;
  setDiscordTargetData: React.Dispatch<
    React.SetStateAction<DiscordTarget | undefined>
  >;
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
  const {
    canary: { isActive: isCanaryActive, frontendClient },
  } = useNotifiClientContext();

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

  const [alerts, setAlerts] = useState<Record<string, Alert | undefined>>({});
  const [connectedWallets, setConnectedWallets] = useState<
    ReadonlyArray<ConnectedWallet>
  >([]);
  const [useHardwareWallet, setUseHardwareWallet] = useState<boolean>(false);
  const [useDiscord, setUseDiscord] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [telegramId, setTelegramId] = useState<string>('');

  const [discordTargetData, setDiscordTargetData] = useState<
    DiscordTarget | undefined
  >(undefined);

  const [destinationErrorMessages, setDestinationErrorMessages] =
    useState<DestinationErrorMessages>({
      email: undefined,
      telegram: undefined,
      phoneNumber: undefined,
      discord: undefined,
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

  const resetErrorMessageState = () => {
    setDestinationErrorMessages({
      email: undefined,
      telegram: undefined,
      phoneNumber: undefined,
      discord: undefined,
    });
  };

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
      isCanaryActive
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

  const render = useCallback(
    (newData: Types.FetchDataQuery): SubscriptionData => {
      const targetGroup = newData.targetGroup?.find(
        (tg) => tg?.name === 'Default',
      );
      const alerts: Record<string, Alert> = {};
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

      if (!isPhoneNumberConfirmed) {
        setPhoneNumberErrorMessage({
          type: 'unrecoverableError',
          message: 'Messages stopped',
          tooltip: `Please text 'start' to the following number:\n${
            params.env === 'Production' ? '+1 206 222 3465' : '+1 253 880 1477 '
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

      if (!telegramTarget?.isConfirmed) {
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

      const discordId = discordTarget?.id;

      if (discordId) {
        const { isConfirmed, userStatus, verificationLink } = discordTarget;

        if (!isConfirmed) {
          setDiscordErrorMessage({
            type: 'recoverableError',
            onClick: () => window.open(verificationLink, '_blank'),
            message: 'Enable Bot',
          });
        } else if (
          userStatus === DiscordTargetStatus.DISCORD_SERVER_NOT_JOINED
        ) {
          setDiscordErrorMessage({
            type: 'recoverableError',
            onClick: () => window.open(DISCORD_INVITE_URL, '_blank'),
            message: 'Join Server',
          });
        } else {
          setDiscordErrorMessage(undefined);
        }
        setUseDiscord(true);
        setDiscordTargetData(discordTarget);
      } else {
        const targets = newData?.discordTarget;
        const target =
          targets?.find((target) => target.isConfirmed) || targets?.[0];
        setDiscordTargetData(target);
        setUseDiscord(false);
      }

      return {
        alerts,
        email: emailTarget?.emailAddress ?? null,
        isPhoneNumberConfirmed,
        phoneNumber,
        telegramConfirmationUrl: telegramTarget?.confirmationUrl ?? null,
        telegramId: telegramTarget?.telegramId ?? null,
        discordId: discordTarget?.id ?? null,
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
    useDiscord,
    setUseDiscord,
    discordTargetData,
    setDiscordTargetData,
    render,
  };

  return (
    <NotifiSubscriptionContext.Provider value={value}>
      {children}
    </NotifiSubscriptionContext.Provider>
  );
};

export const useNotifiSubscriptionContext: () => NotifiSubscriptionData =
  () => {
    const data = useContext(NotifiSubscriptionContext);
    return data;
  };
