import { useNotifiSubscriptionContext } from '../context';
import type {
  Alert,
  ClientData,
  Filter,
  FilterOptions,
  Source,
} from '@notifi-network/notifi-core';
import { useNotifiClient } from '@notifi-network/notifi-react-hooks';
import parsePhoneNumber from 'libphonenumber-js';
import { useCallback, useEffect } from 'react';

export type SubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert>>;
  email: string | null;
  phoneNumber: string | null;
}>;

const isEmpty: <T extends Record<string, unknown>>(input: T) => boolean = (
  input,
) => {
  Object.keys(input).forEach((key) => {
    const value = input[key];
    if (value !== undefined) {
      return false;
    }
  });

  return true;
};

const areFilterOptionsEqual = (
  input: FilterOptions | null,
  serialized: string | null,
): boolean => {
  if (serialized === null) {
    return input === null || isEmpty(input);
  }

  if (input === null) {
    return serialized === '{}';
  }

  return JSON.stringify(input) === serialized;
};

export const useNotifiSubscribe: () => Readonly<{
  loading: boolean;
  subscribe: () => Promise<void>;
}> = () => {
  const {
    params: { dappAddress, env, walletPublicKey, signer },
  } = useNotifiSubscriptionContext();

  const {
    loading,
    createAlert,
    createSource,
    deleteAlert,
    fetchData,
    isAuthenticated,
    logIn,
  } = useNotifiClient({
    dappAddress,
    env,
    walletPublicKey,
  });

  const {
    email: inputEmail,
    phoneNumber: inputPhoneNumber,
    getAlertConfigurations,
    setAlerts,
    setEmail,
    setPhoneNumber,
  } = useNotifiSubscriptionContext();

  const render = useCallback(
    (newData: ClientData | null) => {
      const alerts: Record<string, Alert> = {};
      newData?.alerts.forEach((alert) => {
        if (alert.name !== null) {
          alerts[alert.name] = alert;
        }
      });
      setAlerts(alerts);

      const targetGroup = newData?.targetGroups[0];
      const email = targetGroup?.emailTargets[0]?.emailAddress ?? null;
      setEmail(email ?? '');

      const phoneNumber = targetGroup?.smsTargets[0]?.phoneNumber ?? null;
      setPhoneNumber(phoneNumber ?? '');
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

  const subscribe = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      await logIn(signer);
    }

    const data = await fetchData();

    const configurations = getAlertConfigurations();
    const names = Object.keys(configurations);
    const finalEmail = inputEmail === '' ? null : inputEmail;

    let finalPhoneNumber = null;
    if (inputPhoneNumber !== '') {
      const parsedPhoneNumber = parsePhoneNumber(inputPhoneNumber);
      if (parsedPhoneNumber !== undefined) {
        finalPhoneNumber = parsedPhoneNumber.number; // E.164
      }
    }

    const newResults: Record<string, Alert> = {};
    for (let i = 0; i < names.length; ++i) {
      const name = names[i];
      const existingAlert = data.alerts.find((alert) => alert.name === name);
      const deleteThisAlert = async () => {
        if (existingAlert !== undefined && existingAlert.id !== null) {
          await deleteAlert({ alertId: existingAlert.id });
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
        } else if (
          existingAlert !== undefined &&
          existingAlert.id !== null &&
          existingAlert.filter.id === filter.id &&
          existingAlert.sourceGroup.sources.length > 0 &&
          existingAlert.sourceGroup.sources[0].id === source.id &&
          areFilterOptionsEqual(filterOptions, existingAlert.filterOptions)
        ) {
          // Alerts are the same
          newResults[name] = existingAlert;
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
            telegramId: null, // TODO
            groupName: 'managed',
          });

          newResults[name] = alert;
        }
      }
    }

    const newData = await fetchData();
    render(newData);
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
    subscribe,
  };
};
