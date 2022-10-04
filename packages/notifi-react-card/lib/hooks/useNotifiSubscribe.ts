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

export type SubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert>>;
  email: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
  telegramConfirmationUrl: string | null;
}>;

export const useNotifiSubscribe: () => Readonly<{
  isAuthenticated: boolean;
  isInitialized: boolean;
  logIn: () => Promise<SubscriptionData>;
  subscribe: () => Promise<SubscriptionData>;
}> = () => {
  const { client } = useNotifiClientContext();

  const {
    email: inputEmail,
    phoneNumber: inputPhoneNumber,
    telegramId: inputTelegramId,
    params,
    useHardwareWallet,
    getAlertConfigurations,
    setAlerts,
    setEmail,
    setPhoneNumber,
    setTelegramId,
    setTelegramConfirmationUrl,
    setLoading,
  } = useNotifiSubscriptionContext();

  const { keepSubscriptionData = true, walletPublicKey } = params;

  const render = useCallback(
    (newData: ClientData | null): SubscriptionData => {
      const configurations = getAlertConfigurations();
      let targetGroup = newData?.targetGroups[0];

      const alerts: Record<string, Alert> = {};
      newData?.alerts.forEach((alert) => {
        if (alert.name !== null) {
          alerts[alert.name] = alert;
          if (alert.name in configurations) {
            targetGroup = alert.targetGroup;
          }
        }
      });
      setAlerts(alerts);
      const email = targetGroup?.emailTargets[0]?.emailAddress ?? null;
      setEmail(email ?? '');

      const phoneNumber = targetGroup?.smsTargets[0]?.phoneNumber ?? null;
      setPhoneNumber(phoneNumber ?? '');

      const telegramTarget = targetGroup?.telegramTargets[0];
      setTelegramId(telegramTarget?.telegramId ?? '');
      setTelegramConfirmationUrl(telegramTarget?.confirmationUrl ?? undefined);

      return {
        alerts,
        email,
        phoneNumber,
        telegramId: telegramTarget?.telegramId ?? null,
        telegramConfirmationUrl: telegramTarget?.confirmationUrl ?? null,
      };
    },
    [setAlerts, setEmail, setPhoneNumber],
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
          keys: [
            {
              pubkey: publicKey,
              isSigner: true,
              isWritable: false,
            },
          ],
          data: Buffer.from(logValue, 'utf-8'),
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

  const subscribe = useCallback(async (): Promise<SubscriptionData> => {
    const currentConfigs = getAlertConfigurations();
    const configurations = { ...currentConfigs };

    const names = Object.keys(configurations);
    const finalEmail = inputEmail === '' ? null : inputEmail;
    const finalTelegramId = inputTelegramId === '' ? null : inputTelegramId;

    let finalPhoneNumber = null;
    if (isValidPhoneNumber(inputPhoneNumber)) {
      finalPhoneNumber = inputPhoneNumber;
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
          filterType,
          filterOptions,
          createSource: createSourceParam,
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
              name: createSourceParam.address,
              blockchainAddress: createSourceParam.address,
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
            name,
            sourceId: source.id,
            filterId: filter.id,
            filterOptions: filterOptions ?? undefined,
            emailAddress: finalEmail,
            phoneNumber: finalPhoneNumber,
            telegramId: finalTelegramId,
            groupName: 'managed',
            targetGroupName: 'Default',
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
        name: 'Default',
        emailAddress: finalEmail,
        phoneNumber: finalPhoneNumber,
        telegramId: finalTelegramId,
      });
    }

    const newData = await client.fetchData();

    const results = render(newData);
    setLoading(false);
    return results;
  }, [
    client,
    getAlertConfigurations,
    inputEmail,
    inputPhoneNumber,
    inputTelegramId,
    logIn,
    setLoading,
  ]);

  return {
    logIn,
    isAuthenticated: client.isAuthenticated,
    isInitialized: client.isInitialized,
    subscribe,
  };
};
