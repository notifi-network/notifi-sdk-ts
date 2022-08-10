import type {
  Alert,
  ClientData,
  Filter,
  Source,
} from '@notifi-network/notifi-core';
import { useNotifiClient } from '@notifi-network/notifi-react-hooks';
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { useCallback, useEffect } from 'react';

import { useNotifiSubscriptionContext } from '../context';

export type SubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert>>;
  email: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
  telegramConfirmationUrl: string | null;
}>;

export const useNotifiSubscribe: () => Readonly<{
  loading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  logIn: () => Promise<SubscriptionData>;
  subscribe: () => Promise<SubscriptionData>;
}> = () => {
  const {
    email: inputEmail,
    phoneNumber: inputPhoneNumber,
    telegramId: inputTelegramId,
    params: {
      dappAddress,
      env,
      keepSubscriptionData,
      walletPublicKey,
      signer,
      connection,
      sendTransaction,
    },
    useHardwareWallet,
    getAlertConfigurations,
    setAlerts,
    setEmail,
    setPhoneNumber,
    setTelegramId,
    setTelegramConfirmationUrl,
  } = useNotifiSubscriptionContext();

  const {
    loading,
    createAlert,
    createSource,
    deleteAlert,
    fetchData,
    isAuthenticated,
    isInitialized,
    logIn: clientLogIn,
    beginLoginViaTransaction,
    completeLoginViaTransaction,
    updateAlert,
    ensureTargetGroup,
  } = useNotifiClient({
    dappAddress,
    env,
    walletPublicKey,
  });

  const render = useCallback(
    (newData: ClientData | null): SubscriptionData => {
      const configurations = getAlertConfigurations();
      console.log('DEBUG: 0');
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
      console.log('DEBUG: 1 ' + JSON.stringify(alerts));
      const email = targetGroup?.emailTargets[0]?.emailAddress ?? null;
      console.log('DEBUG: 2 ' + JSON.stringify(email));

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
  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
        .then((data) => {
          render(data);
        })
        .catch((_e) => {
          /* Intentionally empty */
        });
    }
  }, [isAuthenticated]);

  const logInViaHardwareWallet =
    useCallback(async (): Promise<SubscriptionData> => {
      // Obtain nonce from Notifi
      const { logValue } = await beginLoginViaTransaction();

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
      await completeLoginViaTransaction({
        transactionSignature: signature,
      });

      const newData = await fetchData();
      return render(newData);
    }, [
      walletPublicKey,
      beginLoginViaTransaction,
      connection,
      sendTransaction,
      completeLoginViaTransaction,
      fetchData,
      render,
    ]);

  const logIn = useCallback(async (): Promise<SubscriptionData> => {
    if (!isAuthenticated) {
      if (useHardwareWallet) {
        await logInViaHardwareWallet();
      } else {
        await clientLogIn(signer);
      }
    }

    const newData = await fetchData();
    return render(newData);
  }, [clientLogIn, signer, useHardwareWallet]);

  const subscribe = useCallback(async (): Promise<SubscriptionData> => {
    console.log('In subscribe');
    const configurations = getAlertConfigurations();
    console.log('configurations =>', configurations);

    const names = Object.keys(configurations);
    const finalEmail = inputEmail === '' ? null : inputEmail;
    const finalTelegramId = inputTelegramId === '' ? null : inputTelegramId;

    let finalPhoneNumber = null;
    if (inputPhoneNumber !== '') {
      if (inputPhoneNumber.startsWith('+')) {
        finalPhoneNumber = inputPhoneNumber;
      } else {
        // Assume US for now
        finalPhoneNumber = `+1${inputPhoneNumber}`;
      }
    }

    if (!isAuthenticated) {
      await logIn();
    }

    console.log('After login');
    const data = await fetchData();
    console.log('After fetchData');

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
          console.log('case -5');
          await deleteAlert({
            alertId: existingAlert.id,
            keepSourceGroup: keepSubscriptionData,
            keepTargetGroup: keepSubscriptionData,
          });
        }
      };

      const config = configurations[name];
      if (config === undefined || config === null) {
        console.log('case -4');
        await deleteThisAlert();
      } else {
        console.log('case -3');
        const {
          filterType,
          filterOptions,
          createSource: createSourceParam,
          sourceType,
        } = config;

        let source: Source | undefined;
        let filter: Filter | undefined;
        if (createSourceParam !== undefined) {
          console.log('case -2');
          const existing = data.sources.find(
            (s) =>
              s.type === sourceType &&
              s.blockchainAddress === createSourceParam.address,
          );
          if (existing !== undefined) {
            console.log('case -1');
            source = existing;
            filter = source.applicableFilters.find(
              (f) => f.filterType === filterType,
            );
          } else {
            console.log('case 0');
            source = await createSource({
              name: createSourceParam.address,
              blockchainAddress: createSourceParam.address,
              type: sourceType,
            });
            filter = source.applicableFilters.find(
              (f) => f.filterType === filterType,
            );
          }
        } else {
          console.log('case 1');
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
          console.log('case 2');
          await deleteThisAlert();
        } else if (existingAlert !== undefined && existingAlert.id !== null) {
          console.log('case 3');
          const alert = await updateAlert({
            alertId: existingAlert.id,
            emailAddress: finalEmail,
            phoneNumber: finalPhoneNumber,
            telegramId: finalTelegramId,
          });
          newResults[name] = alert;
        } else {
          console.log('create alert being called');
          // Call serially because of limitations
          await deleteThisAlert();
          const alert = await createAlert({
            name,
            sourceId: source.id,
            filterId: filter.id,
            filterOptions: filterOptions ?? undefined,
            emailAddress: finalEmail,
            phoneNumber: finalPhoneNumber,
            telegramId: finalTelegramId,
            groupName: 'managed',
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
      await ensureTargetGroup({
        name: 'Default',
        emailAddress: finalEmail,
        phoneNumber: finalPhoneNumber,
        telegramId: finalTelegramId,
      });
    }

    console.log('last fetchData called');

    const newData = await fetchData();
    console.log('render being called');

    return render(newData);
  }, [
    createAlert,
    deleteAlert,
    fetchData,
    getAlertConfigurations,
    inputEmail,
    inputPhoneNumber,
    inputTelegramId,
    isAuthenticated,
    logIn,
  ]);

  return {
    loading,
    logIn,
    isAuthenticated,
    isInitialized,
    subscribe,
  };
};
