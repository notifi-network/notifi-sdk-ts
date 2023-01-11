import type {
  Alert,
  ClientData,
  Filter,
  Source,
} from '@notifi-network/notifi-core';
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useCallback, useEffect, useRef } from 'react';

import { useNotifiSubscriptionContext } from '../context';
import { useNotifiClientContext } from '../context/NotifiClientContext';
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
  instantSubscribe: (
    subscribeData: InstantSubscribe,
  ) => Promise<SubscriptionData>;
  updateTargetGroups: () => Promise<SubscriptionData>;
  resendEmailVerificationLink: () => Promise<string>;
}> = ({ targetGroupName = 'Default' }: useNotifiSubscribeProps) => {
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
    const resend = await client.sendEmailTargetVerification({
      targetId: emailIdThatNeedsConfirmation,
    });

    return resend;
  }, [emailIdThatNeedsConfirmation, client.sendEmailTargetVerification]);

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

      setFormTelegram(telegramId ?? '');
      setTelegramId(telegramId ?? '');

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

  // Initial fetch
  const didFetch = useRef(false);
  useEffect(() => {
    if (client.isAuthenticated && !didFetch.current) {
      didFetch.current = true;
      client
        .fetchData()
        .then((data) => {
          render(data);
        })
        .catch((_e) => {
          /* Intentionally empty */
        });
    }
  }, [client.isAuthenticated]);

  const logInViaHardwareWallet =
    useCallback(async (): Promise<SubscriptionData> => {
      if (params.walletBlockchain !== 'SOLANA') {
        throw new Error('Unsupported wallet blockchain');
      }

      const { connection, sendTransaction } = params;

      // Obtain nonce from Notifi
      const { logValue } = await client.beginLoginViaTransaction();

      // Commit a transaction with the Memo program
      const publicKey = new PublicKey(walletPublicKey);
      const latestBlockHash = await connection.getLatestBlockhash();
      const txn = new Transaction();
      txn.recentBlockhash = latestBlockHash.blockhash;
      txn.feePayer = publicKey;
      txn.add(
        new TransactionInstruction({
          data: Buffer.from(logValue, 'utf-8'),
          keys: [
            {
              isSigner: true,
              isWritable: false,
              pubkey: publicKey,
            },
          ],
          programId: new PublicKey(
            'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
          ),
        }),
      );

      // Send transaction and wait for it to confirm
      const blockHashAgain = await connection.getLatestBlockhash();
      const signature = await sendTransaction(txn, connection);
      await connection.confirmTransaction({
        blockhash: blockHashAgain.blockhash,
        lastValidBlockHeight: blockHashAgain.lastValidBlockHeight,
        signature,
      });

      // Inform Notifi of the signature so that we can complete login
      await client.completeLoginViaTransaction({
        transactionSignature: signature,
      });

      const newData = await client.fetchData();
      return render(newData);
    }, [walletPublicKey, client, params, render]);

  const logIn = useCallback(async (): Promise<SubscriptionData> => {
    setLoading(true);
    if (!client.isAuthenticated) {
      if (useHardwareWallet) {
        await logInViaHardwareWallet();
      } else {
        await client.logIn(params);
      }
    }

    const newData = await client.fetchData();
    const results = render(newData);
    setLoading(false);
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
  ]);

  const subscribe = useCallback(
    async (
      alertConfigs: Record<string, AlertConfiguration>,
    ): Promise<SubscriptionData> => {
      const configurations = { ...alertConfigs };

      const names = Object.keys(configurations);

      const finalEmail = formEmail === '' ? null : formEmail;
      const finalTelegramId = formTelegram === '' ? null : formTelegram;

      let finalPhoneNumber = null;
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

      const newResults: Record<string, Alert> = {};
      for (let i = 0; i < names.length; ++i) {
        const name = names[i];
        const existingAlert = data.alerts.find((alert) => alert.name === name);
        const deleteThisAlert = async () => {
          if (existingAlert !== undefined && existingAlert.id !== null) {
            await client.deleteAlert({
              alertId: existingAlert.id,
              keepSourceGroup: keepSubscriptionData,
              keepTargetGroup: keepSubscriptionData,
            });
          }
        };

        const config = configurations[name];
        if (config === undefined || config === null) {
          await deleteThisAlert();
        } else {
          const {
            createSource: createSourceParam,
            filterOptions,
            filterType,
            sourceType,
          } = config;

          let source: Source | undefined;
          let filter: Filter | undefined;
          if (createSourceParam !== undefined) {
            const existing = data.sources.find(
              (s) =>
                s.type === sourceType &&
                s.blockchainAddress === createSourceParam.address,
            );
            if (existing !== undefined) {
              source = existing;
              filter = source.applicableFilters.find(
                (f) => f.filterType === filterType,
              );
            } else {
              source = await client.createSource({
                blockchainAddress: createSourceParam.address,
                name: createSourceParam.address,
                type: sourceType,
              });
              filter = source.applicableFilters.find(
                (f) => f.filterType === filterType,
              );
            }
          } else {
            source = data.sources.find((s) => s.type === sourceType);
            filter = source?.applicableFilters.find(
              (f) => f.filterType === filterType,
            );
          }

          if (
            source === undefined ||
            source.id === null ||
            filter === undefined ||
            filter.id === null
          ) {
            await deleteThisAlert();
          } else if (existingAlert !== undefined && existingAlert.id !== null) {
            const alert = await client.updateAlert({
              alertId: existingAlert.id,
              emailAddress: finalEmail,
              phoneNumber: finalPhoneNumber,
              telegramId: finalTelegramId,
            });
            newResults[name] = alert;
          } else {
            // Call serially because of limitations
            await deleteThisAlert();
            const alert = await client.createAlert({
              emailAddress: finalEmail,
              filterId: filter.id,
              filterOptions: filterOptions ?? undefined,
              groupName: 'managed',
              name,
              phoneNumber: finalPhoneNumber,
              sourceId: source.id,
              targetGroupName,
              telegramId: finalTelegramId,
            });

            newResults[name] = alert;
          }
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
    const finalEmail = formEmail === '' ? null : formEmail;

    const finalTelegramId = formTelegram === '' ? null : formTelegram;
    let finalPhoneNumber = null;

    if (isValidPhoneNumber(formPhoneNumber)) {
      finalPhoneNumber = formPhoneNumber;
    }
    await client.ensureTargetGroup({
      emailAddress: finalEmail,
      name: targetGroupName,
      phoneNumber: finalPhoneNumber,
      telegramId: finalTelegramId,
    });

    const newData = await client.fetchData();

    const results = render(newData);
    setLoading(false);
    return results;
  }, [client, formEmail, formPhoneNumber, formTelegram, render, setLoading]);

  const instantSubscribe = useCallback(
    async (alertData: InstantSubscribe) => {
      const { alertConfiguration, alertName } = alertData;

      const finalEmail = formEmail === '' ? null : formEmail;

      const finalTelegramId = formTelegram === '' ? null : formTelegram;
      let finalPhoneNumber = null;
      if (isValidPhoneNumber(formPhoneNumber)) {
        finalPhoneNumber = formPhoneNumber;
      }
      setLoading(true);

      await logIn();
      const data = await client.fetchData();
      //
      // Yes, we're ignoring the server side values and just using whatever the client typed in
      // We should eventually always start from a logged in state from client having called
      // "refresh" or "fetchData" to obtain existing settings first
      //

      const newResults: Record<string, Alert> = {};

      const existingAlert = data.alerts.find(
        (alert) => alert.name === alertName,
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
      if (alertConfiguration === undefined || alertConfiguration === null) {
        await deleteThisAlert();
      } else {
        const {
          createSource: createSourceParam,
          filterOptions,
          filterType,
          sourceType,
        } = alertConfiguration;

        let source: Source | undefined;
        let filter: Filter | undefined;
        if (createSourceParam !== undefined) {
          const existing = data.sources.find(
            (s) =>
              s.type === sourceType &&
              s.blockchainAddress === createSourceParam.address,
          );
          if (existing !== undefined) {
            source = existing;
            filter = source.applicableFilters.find(
              (f) => f.filterType === filterType,
            );
          } else {
            source = await client.createSource({
              blockchainAddress: createSourceParam.address,
              name: createSourceParam.address,
              type: sourceType,
            });
            filter = source.applicableFilters.find(
              (f) => f.filterType === filterType,
            );
          }
        } else {
          source = data.sources.find((s) => s.type === sourceType);
          filter = source?.applicableFilters.find(
            (f) => f.filterType === filterType,
          );
        }
        if (
          source === undefined ||
          source.id === null ||
          filter === undefined ||
          filter.id === null
        ) {
          await deleteThisAlert();
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
          });
          newResults[alertName] = alert;
        } else {
          // Call serially because of limitations
          await deleteThisAlert();
          const alert = await client.createAlert({
            emailAddress: finalEmail,
            filterId: filter.id,
            filterOptions: filterOptions ?? undefined,
            groupName: 'managed',
            name: alertName,
            phoneNumber: finalPhoneNumber,
            sourceId: source.id,
            targetGroupName,
            telegramId: finalTelegramId,
          });
          newResults[alertName] = alert;
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
        });
      }
      const newData = await client.fetchData();
      const results = render(newData);
      setLoading(false);
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
    ],
  );

  return {
    resendEmailVerificationLink,
    instantSubscribe,
    isAuthenticated: client.isAuthenticated,
    isInitialized: client.isInitialized,
    isTokenExpired: client.isTokenExpired,
    logIn,
    subscribe,
    updateTargetGroups,
  };
};
