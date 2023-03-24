import type {
  Alert,
  ClientData,
  ConnectWalletParams,
  CreateSourceInput,
  Source,
} from '@notifi-network/notifi-core';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useCallback, useEffect, useRef } from 'react';

import { defaultDemoConfigV1, useNotifiSubscriptionContext } from '../context';
import { useNotifiClientContext } from '../context/NotifiClientContext';
import {
  formatTelegramForSubscription,
  prefixTelegramWithSymbol,
} from '../utils/stringUtils';
import { walletToSource } from '../utils/walletUtils';
import { useNotifiForm } from './../context/NotifiFormContext';
import { AlertConfiguration } from './../utils/AlertConfiguration';

export type SubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert>>;
  email: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
  telegramConfirmationUrl: string | null;
  isPhoneNumberConfirmed: boolean | null;
  emailIdThatNeedsConfirmation: string;
}>;

export type InstantSubscribe = Readonly<{
  alertName: string;
  alertConfiguration: AlertConfiguration | null;
}>;

type useNotifiSubscribeProps = Readonly<{
  targetGroupName?: string;
}>;

const hasKey = <K extends string>(
  obj: object,
  key: K,
): obj is object & { [k in K]: unknown } => {
  return typeof obj === 'object' && obj !== null && key in obj;
};

export const useNotifiSubscribe: ({
  targetGroupName,
}: useNotifiSubscribeProps) => Readonly<{
  isAuthenticated: boolean;
  isInitialized: boolean;
  isTokenExpired: boolean;
  logIn: () => Promise<SubscriptionData>;
  subscribe: (
    alertConfigs: Record<string, AlertConfiguration>,
  ) => Promise<SubscriptionData>;
  subscribeWallet: (walletParams: ConnectWalletParams) => Promise<void>;
  updateWallets: () => Promise<void>;
  instantSubscribe: (
    subscribeData: InstantSubscribe,
  ) => Promise<SubscriptionData>;
  updateTargetGroups: () => Promise<SubscriptionData>;
  resendEmailVerificationLink: () => Promise<string>;
}> = ({ targetGroupName = 'Default' }: useNotifiSubscribeProps) => {
  const { demoPreview } = useNotifiSubscriptionContext();
  // const { client: c } = useNotifiClientContext();
  // const client = c as ReturnType<typeof useNotifiClient> | undefined;
  // Case undefined --> under demoPreview card (No params to init client)
  const clientContext = useNotifiClientContext() as
    | ReturnType<typeof useNotifiClientContext>
    | undefined;

  const {
    formState,
    setEmail: setFormEmail,
    setTelegram: setFormTelegram,
    setPhoneNumber: setFormPhoneNumber,
  } = useNotifiForm();

  const {
    email: formEmail,
    telegram: formTelegram,
    phoneNumber: formPhoneNumber,
  } = formState;

  const {
    params,
    setAlerts,
    setConnectedWallets,
    setEmail,
    setIsSmsConfirmed,
    setLoading,
    setPhoneNumber,
    setTelegramConfirmationUrl,
    setTelegramId,
    emailIdThatNeedsConfirmation,
    setEmailIdThatNeedsConfirmation,
    useHardwareWallet,
  } = useNotifiSubscriptionContext();

  const { keepSubscriptionData = true, walletPublicKey } = params;

  const resendEmailVerificationLink = useCallback(async () => {
    const resend = await clientContext?.client?.sendEmailTargetVerification({
      targetId: emailIdThatNeedsConfirmation,
    });

    return resend ?? '';
  }, [
    emailIdThatNeedsConfirmation,
    clientContext?.client?.sendEmailTargetVerification,
  ]);

  const render = useCallback(
    (newData: ClientData | null): SubscriptionData => {
      const targetGroup = newData?.targetGroups.find(
        (tg) => tg.name === targetGroupName,
      );

      const alerts: Record<string, Alert> = {};
      newData?.alerts.forEach((alert) => {
        if (alert.name !== null) {
          alerts[alert.name] = alert;
        }
      });

      setAlerts(alerts);
      setConnectedWallets(newData?.connectedWallets ?? []);
      const emailTarget = targetGroup?.emailTargets[0] ?? null;
      const emailToSet = emailTarget?.emailAddress ?? '';

      if (emailTarget !== null && emailTarget?.isConfirmed === false) {
        setEmailIdThatNeedsConfirmation(emailTarget.id ?? '');
      } else {
        setEmailIdThatNeedsConfirmation('');
      }

      setFormEmail(emailToSet);
      setEmail(emailToSet);

      const phoneNumber = targetGroup?.smsTargets[0]?.phoneNumber ?? null;

      const isPhoneNumberConfirmed =
        targetGroup?.smsTargets[0]?.isConfirmed ?? null;

      const phoneNumberToSet = phoneNumber ?? '';

      setIsSmsConfirmed(isPhoneNumberConfirmed);

      setFormPhoneNumber(phoneNumberToSet);
      setPhoneNumber(phoneNumberToSet);

      const telegramTarget = targetGroup?.telegramTargets[0];
      const telegramId = telegramTarget?.telegramId;

      const telegramIdWithSymbolAdded =
        telegramId !== '' && telegramId?.length
          ? prefixTelegramWithSymbol(telegramId)
          : null;

      setFormTelegram(telegramId ?? '');
      setTelegramId(telegramIdWithSymbolAdded ?? '');

      setTelegramConfirmationUrl(telegramTarget?.confirmationUrl ?? undefined);

      return {
        alerts,
        email: emailTarget?.emailAddress ?? null,
        isPhoneNumberConfirmed,
        emailIdThatNeedsConfirmation,
        phoneNumber,
        telegramConfirmationUrl: telegramTarget?.confirmationUrl ?? null,
        telegramId: telegramTarget?.telegramId ?? null,
      };
    },
    [setAlerts, setEmail, setPhoneNumber, setTelegramId],
  );

  const copyAuths = useCallback(
    async (data: ClientData) => {
      if (params.multiWallet !== undefined && clientContext?.client) {
        params.multiWallet.ownedWallets.forEach((wallet) => {
          const key = 'accountAddress';
          const address = hasKey(wallet, key)
            ? wallet[key]
            : wallet.walletPublicKey;
          if (
            data.connectedWallets.find(
              (cw) =>
                cw.address === address &&
                cw.walletBlockchain === wallet.walletBlockchain,
            ) !== undefined
          ) {
            clientContext?.client
              .copyAuthorization(wallet.walletPublicKey)
              .catch(console.log);
          }
        });
      }
    },
    [clientContext?.client, params],
  );

  // Initial fetch
  const didFetch = useRef(false);
  useEffect(() => {
    if (clientContext?.client?.isAuthenticated && !didFetch.current) {
      didFetch.current = true;
      clientContext?.client
        .fetchData()
        .then((data) => {
          copyAuths(data);
          render(data);
        })
        .catch((_e) => {
          /* Intentionally empty */
        });
    } else if (demoPreview) {
      // Mockup info for demo preview card
      setEmail(defaultDemoConfigV1.name);
      setPhoneNumber('+101234567890');
      setTelegramId(defaultDemoConfigV1.id!);
    }
  }, [clientContext?.client?.isAuthenticated]);

  const logInViaHardwareWallet =
    useCallback(async (): Promise<SubscriptionData> => {
      if (!clientContext?.client) {
        return dummySubscribeData;
      }
      if (params.walletBlockchain !== 'SOLANA') {
        throw new Error('Unsupported wallet blockchain');
      }

      const plugin = params.hardwareLoginPlugin;

      // Obtain nonce from Notifi
      const { logValue } =
        await clientContext.client.beginLoginViaTransaction();

      // Commit a transaction with the Memo program
      const signature = await plugin.sendMessage(logValue);

      // Inform Notifi of the signature so that we can complete login
      await clientContext?.client.completeLoginViaTransaction({
        transactionSignature: signature,
      });

      const newData = await clientContext?.client.fetchData();
      return render(newData);
    }, [walletPublicKey, clientContext?.client, params, render]);

  const logIn = useCallback(async (): Promise<SubscriptionData> => {
    if (!clientContext?.client) return dummySubscribeData;
    setLoading(true);
    if (!clientContext?.client.isAuthenticated) {
      if (useHardwareWallet) {
        await logInViaHardwareWallet();
      } else {
        await clientContext?.client.logIn(params);
      }
    }

    const newData = await clientContext?.client.fetchData();
    copyAuths(newData);
    const results = render(newData);
    setLoading(false);
    return results;
  }, [
    clientContext?.client?.isAuthenticated,
    clientContext?.client?.logIn,
    clientContext?.client?.fetchData,
    params,
    useHardwareWallet,
    logInViaHardwareWallet,
    render,
    setLoading,
  ]);

  const updateAlertInternal = useCallback(
    async (
      alertParams: InstantSubscribe,
      data: ClientData,
      contacts: Readonly<{
        finalEmail: string | null;
        finalPhoneNumber: string | null;
        finalTelegramId: string | null;
      }>,
    ): Promise<Alert | null> => {
      if (!clientContext?.client) return null;
      const { alertName, alertConfiguration } = alertParams;
      const { finalEmail, finalPhoneNumber, finalTelegramId } = contacts;
      const existingAlert = data.alerts.find(
        (alert) => alert.name === alertName,
      );

      const deleteThisAlert = async () => {
        if (existingAlert !== undefined && existingAlert.id !== null) {
          await clientContext?.client.deleteAlert({
            alertId: existingAlert.id,
            keepSourceGroup: keepSubscriptionData,
            keepTargetGroup: keepSubscriptionData,
          });
        }
      };

      const ensureSource = async (
        params: CreateSourceInput,
      ): Promise<Source> => {
        const existing = data.sources.find(
          (s) =>
            s.type === params.type &&
            s.blockchainAddress === params.blockchainAddress,
        );
        if (existing !== undefined) {
          return existing;
        }

        const created = await clientContext?.client.createSource(params);
        return created;
      };
      if (alertConfiguration === null) {
        await deleteThisAlert();
        return null;
      } else if (alertConfiguration.type === 'multiple') {
        const {
          filterOptions,
          filterType,
          sources: sourcesInput,
          sourceGroupName,
        } = alertConfiguration;
        const sources = await Promise.all(sourcesInput.map(ensureSource));
        const filter = sources
          .flatMap((s) => s.applicableFilters)
          .find((f) => f.filterType === filterType);
        if (filter === undefined || filter.id === null) {
          await deleteThisAlert();
          return null;
        } else {
          const sourceIds: string[] = [];
          sources.forEach((s) => {
            if (s.id !== null) {
              sourceIds.push(s.id);
            }
          });

          // Call serially because of limitations
          await deleteThisAlert();
          const alert = await clientContext?.client.createAlert({
            emailAddress: finalEmail,
            filterId: filter.id,
            filterOptions: filterOptions ?? undefined,
            groupName: 'managed',
            name: alertName,
            phoneNumber: finalPhoneNumber,
            sourceId: '',
            targetGroupName,
            telegramId: finalTelegramId,
            sourceIds,
            sourceGroupName,
          });

          return alert;
        }
      } else {
        const {
          createSource: createSourceParam,
          filterOptions,
          filterType,
          sourceType,
          sourceGroupName,
        } = alertConfiguration;

        let source: Source | undefined;

        if (createSourceParam !== undefined) {
          source = await ensureSource({
            name: createSourceParam.address,
            blockchainAddress: createSourceParam.address,
            type: sourceType,
          });
        } else {
          source = data.sources.find((s) => s.type === sourceType);
        }

        const filter = source?.applicableFilters.find(
          (f) => f.filterType === filterType,
        );

        if (
          source === undefined ||
          source.id === null ||
          filter === undefined ||
          filter.id === null
        ) {
          await deleteThisAlert();
          return null;
        } else if (
          existingAlert !== undefined &&
          existingAlert.id !== null &&
          existingAlert.filterOptions === JSON.stringify(filterOptions)
        ) {
          const alert = await clientContext?.client.updateAlert({
            alertId: existingAlert.id,
            emailAddress: finalEmail,
            phoneNumber: finalPhoneNumber,
            telegramId: finalTelegramId,
          });

          return alert;
        } else {
          // Call serially because of limitations
          await deleteThisAlert();
          const alert = await clientContext?.client.createAlert({
            emailAddress: finalEmail,
            filterId: filter.id,
            filterOptions: filterOptions ?? undefined,
            groupName: 'managed',
            name: alertName,
            phoneNumber: finalPhoneNumber,
            sourceId: source.id,
            targetGroupName,
            telegramId: finalTelegramId,
            sourceGroupName,
          });

          return alert;
        }
      }
    },
    [],
  );

  const subscribe = useCallback(
    async (
      alertConfigs: Record<string, AlertConfiguration>,
    ): Promise<SubscriptionData> => {
      if (!clientContext?.client) return dummySubscribeData;
      const configurations = { ...alertConfigs };

      const names = Object.keys(configurations);

      const finalEmail = formEmail === '' ? null : formEmail;
      const finalTelegramId =
        formTelegram === ''
          ? null
          : formatTelegramForSubscription(formTelegram);

      let finalPhoneNumber = null;
      if (isValidPhoneNumber(formPhoneNumber)) {
        finalPhoneNumber = formPhoneNumber;
      }

      setLoading(true);

      if (!clientContext?.client.isAuthenticated) {
        await logIn();
      }
      const data = await clientContext?.client.fetchData();

      //
      // Yes, we're ignoring the server side values and just using whatever the client typed in
      // We should eventually always start from a logged in state from client having called
      // "refresh" or "fetchData" to obtain existing settings first
      //

      const newResults: Record<string, Alert> = {};
      for (let i = 0; i < names.length; ++i) {
        const name = names[i];

        const config = configurations[name];

        const alert = await updateAlertInternal(
          {
            alertName: name,
            alertConfiguration: config,
          },
          data,
          {
            finalEmail,
            finalPhoneNumber,
            finalTelegramId,
          },
        );
        if (alert !== null) {
          newResults[name] = alert;
        }
      }

      if (
        Object.getOwnPropertyNames(newResults).length === 0 &&
        keepSubscriptionData
      ) {
        // We didn't create or update any alert, manually update the targets
        await clientContext?.client.ensureTargetGroup({
          emailAddress: finalEmail,
          name: targetGroupName,
          phoneNumber: finalPhoneNumber,
          telegramId: finalTelegramId,
        });
      }

      const newData = await clientContext?.client.fetchData();

      const results = render(newData);
      setLoading(false);
      return results;
    },
    [
      clientContext?.client,
      formEmail,
      formPhoneNumber,
      formTelegram,
      logIn,
      setLoading,
    ],
  );

  const updateTargetGroups = useCallback(async () => {
    if (!clientContext?.client) return dummySubscribeData;
    const finalEmail = formEmail === '' ? null : formEmail;

    const finalTelegramId =
      formTelegram === '' ? null : formatTelegramForSubscription(formTelegram);

    let finalPhoneNumber = null;

    if (isValidPhoneNumber(formPhoneNumber)) {
      finalPhoneNumber = formPhoneNumber;
    }

    setLoading(true);
    if (!clientContext?.client.isAuthenticated) {
      await logIn();
    }

    await clientContext?.client.ensureTargetGroup({
      emailAddress: finalEmail,
      name: targetGroupName,
      phoneNumber: finalPhoneNumber,
      telegramId: finalTelegramId,
    });

    const newData = await clientContext?.client.fetchData();

    const results = render(newData);
    setLoading(false);
    return results;
  }, [
    clientContext?.client,
    formEmail,
    formPhoneNumber,
    formTelegram,
    render,
    setLoading,
  ]);

  const instantSubscribe = useCallback(
    async (alertData: InstantSubscribe) => {
      if (!clientContext?.client) return dummySubscribeData;
      const finalEmail = formEmail === '' ? null : formEmail;

      const finalTelegramId =
        formTelegram === ''
          ? null
          : formatTelegramForSubscription(formTelegram);
      let finalPhoneNumber = null;
      if (isValidPhoneNumber(formPhoneNumber)) {
        finalPhoneNumber = formPhoneNumber;
      }
      setLoading(true);

      await logIn();
      const data = await clientContext?.client.fetchData();
      //
      // Yes, we're ignoring the server side values and just using whatever the client typed in
      // We should eventually always start from a logged in state from client having called
      // "refresh" or "fetchData" to obtain existing settings first
      //

      const alert = await updateAlertInternal(alertData, data, {
        finalEmail,
        finalPhoneNumber,
        finalTelegramId,
      });

      if (alert === null && keepSubscriptionData) {
        // We didn't create or update any alert, manually update the targets
        await clientContext?.client.ensureTargetGroup({
          emailAddress: finalEmail,
          name: targetGroupName,
          phoneNumber: finalPhoneNumber,
          telegramId: finalTelegramId,
        });
      }
      const newData = await clientContext?.client.fetchData();
      const results = render(newData);
      setLoading(false);
      return results;
    },
    [
      clientContext?.client,
      formEmail,
      formPhoneNumber,
      formTelegram,
      logIn,
      setLoading,
      subscribe,
      render,
    ],
  );

  const subscribeWallet = useCallback(
    async (params: ConnectWalletParams) => {
      if (!clientContext?.client) return;
      setLoading(true);

      try {
        if (!clientContext?.client.isAuthenticated) {
          await logIn();
        }

        await clientContext?.client.connectWallet(params);

        const newData = await clientContext?.client.fetchData();

        await clientContext?.client.ensureSourceGroup({
          name: 'User Wallets',
          sources: newData.connectedWallets.map(walletToSource),
        });

        const finalData = await clientContext?.client.fetchData();
        copyAuths(finalData);
        render(finalData);
      } finally {
        setLoading(false);
      }
    },
    [clientContext?.client, logIn, setLoading, setConnectedWallets],
  );

  const updateWallets = useCallback(async () => {
    setLoading(true);
    if (!clientContext?.client) return;
    try {
      if (!clientContext?.client.isAuthenticated) {
        await logIn();
      }

      const newData = await clientContext?.client.fetchData();

      await clientContext?.client.ensureSourceGroup({
        name: 'User Wallets',
        sources: newData.connectedWallets.map(walletToSource),
      });

      const finalData = await clientContext?.client.fetchData();
      render(finalData);
    } finally {
      setLoading(false);
    }
  }, [clientContext?.client, logIn, setLoading, render]);

  return {
    resendEmailVerificationLink,
    instantSubscribe,
    isAuthenticated: clientContext?.client?.isAuthenticated ?? false,
    isInitialized: clientContext?.client?.isInitialized ?? false,
    isTokenExpired: clientContext?.client?.isTokenExpired ?? false, // TODO: depends on demoPreview
    logIn,
    subscribe,
    updateTargetGroups,
    subscribeWallet,
    updateWallets,
  };
};

const dummySubscribeData: SubscriptionData = {
  alerts: { dummy: {} as unknown as Alert },
  email: null,
  phoneNumber: null,
  telegramId: null,
  telegramConfirmationUrl: null,
  isPhoneNumberConfirmed: null,
  emailIdThatNeedsConfirmation: '',
};
