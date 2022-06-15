import { useNotifiSubscriptionContext } from '../context';
import type {
  Alert,
  ClientData,
  Filter,
  Source,
} from '@notifi-network/notifi-core';
import { useNotifiClient } from '@notifi-network/notifi-react-hooks';
import { useCallback, useEffect } from 'react';

export type SubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert>>;
  email: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
  telegramConfirmationUrl: string | null;
}>;

export const useNotifiSubscribe: () => Readonly<{
  loading: boolean;
  isInitialized: boolean;
  subscribe: () => Promise<SubscriptionData>;
}> = () => {
  const {
    email: inputEmail,
    phoneNumber: inputPhoneNumber,
    telegramId: inputTelegramId,
    params: { dappAddress, env, keepSubscriptionData, walletPublicKey, signer },
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
    logIn,
    updateAlert,
  } = useNotifiClient({
    dappAddress,
    env,
    walletPublicKey,
  });

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

  const subscribe = useCallback(async (): Promise<SubscriptionData> => {
    if (!isAuthenticated) {
      await logIn(signer);
    }

    const data = await fetchData();

    const configurations = getAlertConfigurations();
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

    const newResults: Record<string, Alert> = {};
    for (let i = 0; i < names.length; ++i) {
      const name = names[i];
      const existingAlert = data.alerts.find((alert) => alert.name === name);
      const deleteThisAlert = async () => {
        if (existingAlert !== undefined && existingAlert.id !== null) {
          await deleteAlert({
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
          const alert = await updateAlert({
            alertId: existingAlert.id,
            emailAddress: finalEmail,
            phoneNumber: finalPhoneNumber,
            telegramId: null, // TODO
          });
          newResults[name] = alert;
        } else {
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

    const newData = await fetchData();
    return render(newData);
  }, [
    createAlert,
    deleteAlert,
    fetchData,
    getAlertConfigurations,
    inputEmail,
    inputPhoneNumber,
    isAuthenticated,
    logIn,
    signer,
  ]);

  return {
    loading,
    isInitialized,
    subscribe,
  };
};
