import { ConnectWalletParams } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  defaultDemoConfigV1,
  useNotifiDemoPreviewContext,
  useNotifiSubscriptionContext,
} from '../context';
import { useNotifiClientContext } from '../context/NotifiClientContext';
import {
  formatTelegramForSubscription,
  prefixTelegramWithSymbol,
} from '../utils/stringUtils';
import { walletToSource } from '../utils/walletUtils';
import { useNotifiForm } from './../context/NotifiFormContext';
import { AlertConfiguration } from './../utils/AlertConfiguration';

export type ClientData = Readonly<{
  alerts: ReadonlyArray<Types.AlertFragmentFragment>;
  connectedWallets: ReadonlyArray<Types.ConnectedWallet>;
  emailTargets: ReadonlyArray<Types.EmailTargetFragmentFragment>;
  filters: ReadonlyArray<Types.FilterFragmentFragment>;
  smsTargets: ReadonlyArray<Types.SmsTargetFragmentFragment>;
  sources: ReadonlyArray<Types.SourceFragmentFragment>;
  targetGroups: ReadonlyArray<Types.TargetGroupFragmentFragment>;
  telegramTargets: ReadonlyArray<Types.TelegramTargetFragmentFragment>;
  sourceGroups: ReadonlyArray<Types.SourceGroupFragmentFragment>;
  discordTargets: ReadonlyArray<Types.DiscordTargetFragmentFragment>;
}>;

export type SubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Types.AlertFragmentFragment>>;
  email: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
  telegramConfirmationUrl: string | null;
  isPhoneNumberConfirmed: boolean | null;
  discordId: string | null;
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
  isEmailConfirmationSent: boolean;
  isInitialized: boolean;
  isTokenExpired: boolean;
  logIn: () => Promise<SubscriptionData>;
  subscribe: (
    alertConfigs: Record<string, AlertConfiguration | null>,
  ) => Promise<SubscriptionData>;
  subscribeWallet: (walletParams: ConnectWalletParams) => Promise<void>;
  updateWallets: () => Promise<void>;
  instantSubscribe: (
    subscribeData: InstantSubscribe,
  ) => Promise<SubscriptionData>;
  updateTargetGroups: () => Promise<SubscriptionData>;
  resendEmailVerificationLink: (emailId: string) => Promise<string>;
  reload: () => Promise<SubscriptionData>;
}> = ({ targetGroupName = 'Default' }: useNotifiSubscribeProps) => {
  const { demoPreview } = useNotifiDemoPreviewContext();
  const { isUsingFrontendClient } = useNotifiClientContext();

  const { client } = useNotifiClientContext();

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
    setLoading,
    setPhoneNumber,
    setTelegramId,
    setPhoneNumberErrorMessage,
    useHardwareWallet,
    resetErrorMessageState,
    setTelegramErrorMessage,
    setEmailErrorMessage,
    setDiscordErrorMessage,
    setUseDiscord,
    useDiscord,
    setDiscordTargetData,
    discordTargetData: discordTargetDatafromSubscriptionContext,
  } = useNotifiSubscriptionContext();

  const { keepSubscriptionData = true, walletPublicKey } = params;

  const [isEmailConfirmationSent, setIsEmailConfirmationSent] =
    useState<boolean>(false);

  const resendEmailVerificationLink = useCallback(
    async (emailId: string) => {
      const resend = await client.sendEmailTargetVerification({
        targetId: emailId,
      });

      return resend;
    },
    [client.sendEmailTargetVerification],
  );

  const handleMissingDiscordTarget = (
    discordTargets: ReadonlyArray<Types.DiscordTargetFragmentFragment>,
  ): void => {
    // Check for the default, and if none exists, use the first discord target.
    const target =
      discordTargets?.find((target) => target.name === 'Default') ||
      discordTargets?.[0];

    setDiscordTargetData(target);
  };

  const render = useCallback(
    (newData: ClientData | null): SubscriptionData => {
      const targetGroup = newData?.targetGroups.find(
        (tg) => tg.name === targetGroupName,
      );

      const alerts: Record<string, Types.AlertFragmentFragment> = {};
      newData?.alerts.forEach((alert) => {
        if (alert?.name) {
          alerts[alert.name] = alert;
        }
      });

      setAlerts(alerts);
      setConnectedWallets(newData?.connectedWallets ?? []);
      const emailTarget = targetGroup?.emailTargets?.[0] ?? null;
      const emailToSet = emailTarget?.emailAddress ?? '';

      if (emailTarget !== null && emailTarget?.isConfirmed === false) {
        setEmailErrorMessage({
          type: 'recoverableError',
          onClick: () => {
            resendEmailVerificationLink(emailTarget.id ?? '');
          },
          message: 'Resend Link',
        });
      } else {
        setEmailErrorMessage(undefined);
      }

      setFormEmail(emailToSet);
      setEmail(emailToSet);

      const phoneNumber = targetGroup?.smsTargets?.[0]?.phoneNumber ?? null;

      const isPhoneNumberConfirmed =
        targetGroup?.smsTargets?.[0]?.isConfirmed ?? null;

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

      setFormPhoneNumber(phoneNumberToSet);
      setPhoneNumber(phoneNumberToSet);

      const telegramTarget = targetGroup?.telegramTargets?.[0];
      const telegramId = telegramTarget?.telegramId;

      const telegramIdWithSymbolAdded =
        telegramId !== '' && telegramId?.length
          ? prefixTelegramWithSymbol(telegramId)
          : null;

      setFormTelegram(telegramId ?? '');
      setTelegramId(telegramIdWithSymbolAdded ?? '');

      if (telegramTarget?.isConfirmed === false) {
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
        const {
          isConfirmed,
          userStatus,
          verificationLink,
          discordServerInviteLink,
        } = discordTarget;

        if (!isConfirmed) {
          setDiscordErrorMessage({
            type: 'recoverableError',
            onClick: () => window.open(verificationLink, '_blank'),
            message: 'Enable Bot',
          });
        } else if (userStatus === 'DISCORD_SERVER_NOT_JOINED') {
          setDiscordErrorMessage({
            type: 'recoverableError',
            onClick: () => window.open(discordServerInviteLink, '_blank'),
            message: 'Join Server',
          });
        } else {
          setDiscordErrorMessage(undefined);
        }
        setUseDiscord(true);
        setDiscordTargetData(discordTarget);
      } else {
        handleMissingDiscordTarget(newData?.discordTargets ?? []);
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
    [
      setAlerts,
      setEmail,
      setPhoneNumber,
      setTelegramId,
      setIsEmailConfirmationSent,
    ],
  );

  const copyAuths = useCallback(
    async (data: ClientData) => {
      if (params.multiWallet !== undefined) {
        params.multiWallet.ownedWallets.forEach((wallet) => {
          const key = 'accountAddress';
          const address = hasKey(wallet, key)
            ? wallet[key]
            : wallet.walletPublicKey;
          if (
            data.connectedWallets.find(
              (cw) =>
                cw?.address === address &&
                cw?.walletBlockchain === wallet.walletBlockchain,
            ) !== undefined
          ) {
            client.copyAuthorization(wallet.walletPublicKey).catch(console.log);
          }
        });
      }
    },
    [client, params],
  );

  // Initial fetch
  const didFetch = useRef(false);
  useEffect(() => {
    if (demoPreview) {
      // Mockup info for demo preview card
      setEmail(defaultDemoConfigV1.name);
      setPhoneNumber('+101234567890');
      setTelegramId(defaultDemoConfigV1.id ?? 'testTelegramId');
      setUseDiscord(true);
    }

    if (client.isAuthenticated && !didFetch.current && !isUsingFrontendClient) {
      didFetch.current = true;
      client
        .fetchData()
        .then((data) => {
          copyAuths(data);
          render(data);
        })
        .catch((_e) => {
          /* Intentionally empty */
        });
    }
  }, [client.isAuthenticated]);

  const logInViaHardwareWallet =
    useCallback(async (): Promise<SubscriptionData> => {
      if (demoPreview) {
        throw new Error('Preview card does not support method call');
      }
      if (params.walletBlockchain !== 'SOLANA') {
        throw new Error('Unsupported wallet blockchain');
      }

      const plugin = params.hardwareLoginPlugin;

      // Obtain nonce from Notifi
      const { logValue } = await client.beginLoginViaTransaction();

      // Commit a transaction with the Memo program
      const signature = await plugin.sendMessage(logValue);

      // Inform Notifi of the signature so that we can complete login
      await client.completeLoginViaTransaction({
        transactionSignature: signature,
      });

      const newData = await client.fetchData();
      return render(newData);
    }, [walletPublicKey, client, params, render]);

  const reload = useCallback(async (): Promise<SubscriptionData> => {
    const newData = await client.fetchData(true);
    copyAuths(newData);
    const results = render(newData);
    return results;
  }, [client.fetchData, copyAuths, render]);

  const logIn = useCallback(async (): Promise<SubscriptionData> => {
    if (demoPreview)
      throw new Error('Preview card does not support method call');
    if (!client.isAuthenticated) {
      if (useHardwareWallet) {
        await logInViaHardwareWallet();
      } else {
        await client.logIn(params);
      }
    }

    const newData = await client.fetchData();

    copyAuths(newData);
    const results = render(newData);
    return results;
  }, [
    client.isAuthenticated,
    client.logIn,
    client.fetchData,
    params,
    useHardwareWallet,
    logInViaHardwareWallet,
    render,
    setLoading,
    copyAuths,
  ]);

  const updateAlertInternal = useCallback(
    async (
      alertParams: InstantSubscribe,
      data: ClientData,
      contacts: Readonly<{
        finalEmail: string | undefined;
        finalPhoneNumber: string | undefined;
        finalTelegramId: string | undefined;
        finalDiscordId: string | undefined;
      }>,
    ): Promise<Types.AlertFragmentFragment | null> => {
      if (demoPreview) throw Error('Preview card does not support method call');
      const { alertName, alertConfiguration } = alertParams;
      const { finalEmail, finalPhoneNumber, finalTelegramId } = contacts;
      const existingAlert = data.alerts.find(
        (alert) => alert?.name === alertName,
      );

      const deleteThisAlert = async () => {
        if (existingAlert !== undefined && existingAlert.id !== null) {
          await client.deleteAlert({
            alertId: existingAlert.id,
            keepSourceGroup: keepSubscriptionData,
            keepTargetGroup: keepSubscriptionData,
          });
        }
      };

      const ensureSource = async (
        params: Types.CreateSourceInput,
      ): Promise<Types.SourceFragmentFragment> => {
        const existing = data.sources.find(
          (s) =>
            s.type === params.type &&
            s.blockchainAddress === params.blockchainAddress &&
            s.fusionEventTypeId === params.fusionEventTypeId,
        );
        if (existing !== undefined) {
          return existing;
        }

        const created = await client.createSource(params);
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
          maintainSourceGroup,
        } = alertConfiguration;

        const sources = await Promise.all(sourcesInput.map(ensureSource));
        const filter = sources
          .flatMap((s) => s.applicableFilters)
          .find((f) => f?.filterType === filterType);
        if (filter === undefined || filter.id === null) {
          await deleteThisAlert();
          throw new Error(
            `No applicableFilters filter for sources: ${JSON.stringify(
              sources,
            )}`,
          );
        } else {
          const sourceIds: string[] = [];
          const existingSourceGroup = data.sourceGroups.find(
            (sourceGroup) =>
              sourceGroup?.name === (sourceGroupName ?? alertName),
          );

          if (maintainSourceGroup && existingSourceGroup) {
            existingSourceGroup.sources?.forEach((s) => {
              const id = s?.id;
              if (id !== null && id !== undefined) {
                sourceIds.push(id);
              }
            });
          } else {
            sources.forEach((s) => {
              if (s.id !== null) {
                sourceIds.push(s.id);
              }
            });
          }

          // Call serially because of limitations
          await deleteThisAlert();

          const alert = await client.createAlert({
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
            includeDiscord: useDiscord,
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
          maintainSourceGroup,
        } = alertConfiguration;

        let source: Types.Maybe<Types.SourceFragmentFragment>;

        if (createSourceParam !== undefined) {
          const eventTypeId = createSourceParam.fusionEventTypeId;
          const address = createSourceParam.address;
          const name =
            eventTypeId !== undefined ? `${eventTypeId}:;:${address}` : address;
          source = await ensureSource({
            name,
            blockchainAddress: address,
            type: sourceType,
            fusionEventTypeId: eventTypeId,
          });
        } else {
          source = data.sources.find((s) => s.type === sourceType);
        }

        const filter = source?.applicableFilters?.find(
          (f) => f?.filterType === filterType,
        );

        if (
          source === undefined ||
          source.id === null ||
          filter === undefined ||
          filter.id === null
        ) {
          await deleteThisAlert();
          throw new Error(
            `No applicableFilters filter for source: ${JSON.stringify(source)}`,
          );
        } else if (
          existingAlert !== undefined &&
          existingAlert.id !== null &&
          existingAlert.filterOptions === JSON.stringify(filterOptions)
        ) {
          const alert = await client.updateAlert({
            alertId: existingAlert.id,
            emailAddress: finalEmail,
            phoneNumber: finalPhoneNumber,
            telegramId: finalTelegramId,
            includeDiscord: useDiscord,
          });

          return alert;
        } else {
          // Call serially because of limitations

          const sourceIds: string[] = [];

          const existingSourceGroup = data.sourceGroups.find(
            (sourceGroup) =>
              sourceGroup?.name === (sourceGroupName ?? alertName),
          );

          if (maintainSourceGroup && existingSourceGroup) {
            existingSourceGroup.sources?.forEach((s) => {
              const id = s?.id;
              if (id !== null && id !== undefined) {
                sourceIds.push(id);
              }
            });
          } else {
            sourceIds.push(source.id);
          }
          await deleteThisAlert();
          const alert = await client.createAlert({
            emailAddress: finalEmail,
            filterId: filter.id,
            filterOptions: filterOptions ?? undefined,
            groupName: 'managed',
            name: alertName,
            phoneNumber: finalPhoneNumber,
            sourceId: '',
            sourceIds,
            targetGroupName,
            telegramId: finalTelegramId,
            sourceGroupName,
            includeDiscord: useDiscord,
          });

          return alert;
        }
      }
    },
    [],
  );

  const subscribe = useCallback(
    async (
      alertConfigs: Record<string, AlertConfiguration | null>,
    ): Promise<SubscriptionData> => {
      if (demoPreview) {
        throw new Error('Preview card does not support method call');
      }
      const configurations = { ...alertConfigs };

      const names = Object.keys(configurations);

      const finalEmail = formEmail === '' ? undefined : formEmail;
      const finalTelegramId =
        formTelegram === ''
          ? undefined
          : formatTelegramForSubscription(formTelegram);

      let finalPhoneNumber = undefined;
      if (isValidPhoneNumber(formPhoneNumber)) {
        finalPhoneNumber = formPhoneNumber;
      }

      setLoading(true);

      if (!client.isAuthenticated) {
        await logIn();
      }
      const data = await client.fetchData();

      //
      // Yes, we're ignoring the server side values and just using whatever the client typed in
      // We should eventually always start from a logged in state from client having called
      // "refresh" or "fetchData" to obtain existing settings first
      //

      const existingDiscordTarget = data.discordTargets.find(
        (target) => target.name === 'Default',
      );

      let finalDiscordId: string | undefined = undefined;

      if (useDiscord === true) {
        if (existingDiscordTarget !== undefined) {
          finalDiscordId = existingDiscordTarget.id;
        } else {
          finalDiscordId = await client.createDiscordTarget('Default');
        }
      }

      const newResults: Record<string, Types.AlertFragmentFragment> = {};
      for (let i = 0; i < names.length; ++i) {
        const name = names[i];

        const config = configurations[name];

        let alert = null;
        try {
          alert = await updateAlertInternal(
            {
              alertName: name,
              alertConfiguration: config,
            },
            data,
            {
              finalEmail,
              finalPhoneNumber,
              finalTelegramId,
              finalDiscordId,
            },
          );
        } catch (e) {
          console.log(`Error updating alert ${name}: ${e}`);
        }

        if (alert !== null) {
          newResults[name] = alert;
        }
      }

      if (
        Object.getOwnPropertyNames(newResults).length === 0 &&
        keepSubscriptionData
      ) {
        // We didn't create or update any alert, manually update the targets
        await client.ensureTargetGroup({
          emailAddress: finalEmail,
          name: targetGroupName,
          phoneNumber: finalPhoneNumber,
          telegramId: finalTelegramId,
          includeDiscord: useDiscord,
        });
      }

      const newData = await client.fetchData();

      const results = render(newData);
      setLoading(false);
      return results;
    },
    [client, formEmail, formPhoneNumber, formTelegram, logIn, setLoading],
  );

  const updateTargetGroups = useCallback(async () => {
    resetErrorMessageState();

    if (demoPreview) {
      throw new Error('Preview card does not support method call');
    }

    const finalEmail = formEmail === '' ? undefined : formEmail;

    const finalTelegramId =
      formTelegram === ''
        ? undefined
        : formatTelegramForSubscription(formTelegram);

    let finalPhoneNumber = undefined;

    if (isValidPhoneNumber(formPhoneNumber)) {
      finalPhoneNumber = formPhoneNumber;
    }

    setLoading(true);
    if (!client.isAuthenticated) {
      await logIn();
    }

    await client.ensureTargetGroup({
      emailAddress: finalEmail,
      name: targetGroupName,
      phoneNumber: finalPhoneNumber,
      telegramId: finalTelegramId,
      includeDiscord: useDiscord,
    });

    const newData = await client.fetchData();

    const results = render(newData);
    setLoading(false);
    return results;
  }, [
    client,
    formEmail,
    formPhoneNumber,
    formTelegram,
    render,
    setLoading,
    useDiscord,
  ]);

  const instantSubscribe = useCallback(
    async (alertData: InstantSubscribe) => {
      if (demoPreview)
        throw new Error('Preview card does not support method call');
      const finalEmail = formEmail === '' ? undefined : formEmail;

      const finalTelegramId =
        formTelegram === ''
          ? undefined
          : formatTelegramForSubscription(formTelegram);
      let finalPhoneNumber = undefined;
      if (isValidPhoneNumber(formPhoneNumber)) {
        finalPhoneNumber = formPhoneNumber;
      }

      const finalDiscordId =
        useDiscord === false || !discordTargetDatafromSubscriptionContext?.id
          ? undefined
          : discordTargetDatafromSubscriptionContext?.id;

      try {
        setLoading(true);
        await logIn();
        const data = await client.fetchData();

        //
        // Yes, we're ignoring the server side values and just using whatever the client typed in
        // We should eventually always start from a logged in state from client having called
        // "refresh" or "fetchData" to obtain existing settings first
        //

        const alert = await updateAlertInternal(alertData, data, {
          finalEmail,
          finalPhoneNumber,
          finalTelegramId,
          finalDiscordId,
        });

        if (alert === null && keepSubscriptionData) {
          // We didn't create or update any alert, manually update the targets
          await client.ensureTargetGroup({
            emailAddress: finalEmail,
            name: targetGroupName,
            phoneNumber: finalPhoneNumber,
            telegramId: finalTelegramId,
            includeDiscord: useDiscord,
          });
        }
      } catch (e) {
        throw new Error(`Something went wrong: ${e}`);
      } finally {
        setLoading(false);
      }
      const newData = await client.fetchData();
      const results = render(newData);
      return results;
    },
    [
      client,
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
      if (demoPreview)
        throw new Error('Preview card does not support method call');
      setLoading(true);

      try {
        if (!client.isAuthenticated) {
          await logIn();
        }

        await client.connectWallet(params);

        const newData = await client.fetchData();

        await client.ensureSourceGroup({
          name: 'User Wallets',
          sources: newData.connectedWallets.map(walletToSource),
        });

        const finalData = await client.fetchData();
        copyAuths(finalData);
        render(finalData);
      } finally {
        setLoading(false);
      }
    },
    [client, logIn, setLoading, setConnectedWallets],
  );

  const updateWallets = useCallback(async () => {
    setLoading(true);
    if (demoPreview)
      throw new Error('Preview card does not support method call');
    try {
      if (!client.isAuthenticated) {
        await logIn();
      }

      const newData = await client.fetchData();

      await client.ensureSourceGroup({
        name: 'User Wallets',
        sources: newData.connectedWallets.map(walletToSource),
      });

      const finalData = await client.fetchData();
      render(finalData);
    } finally {
      setLoading(false);
    }
  }, [client, logIn, setLoading, render]);

  return {
    isEmailConfirmationSent,
    resendEmailVerificationLink,
    instantSubscribe,
    isAuthenticated: client.isAuthenticated,
    isInitialized: client.isInitialized,
    isTokenExpired: client.isTokenExpired,
    logIn,
    subscribe,
    updateTargetGroups,
    subscribeWallet,
    updateWallets,
    reload,
  };
};
