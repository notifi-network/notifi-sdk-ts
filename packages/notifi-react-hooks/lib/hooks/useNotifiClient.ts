import {
  NotifiClient,
  ClientData,
  NotifiService,
  TargetGroup,
  Filter,
  Source,
  SourceGroup,
  Alert,
  EmailTarget,
  SmsTarget,
  TelegramTarget,
  MessageSigner,
  ClientUpdateAlertInput,
  ClientCreateAlertInput,
  ClientDeleteAlertInput
} from '@notifi-network/notifi-core';
import useNotifiService from './useNotifiService';
import useNotifiConfig, { BlockchainEnvironment } from './useNotifiConfig';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useNotifiJwt from './useNotifiJwt';

/**
 * Config options for Notifi SDK
 *
 * @remarks
 * Configuration object for new Notifi SDK instance
 *
 * @property dappAddress - Blockchain address of the dapp
 * @property walletPublicKey - User's wallet address
 * @property env - Solana blockchain env to use
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type NotifiClientConfig = Readonly<{
  dappAddress: string;
  walletPublicKey: string;
  env?: BlockchainEnvironment;
}>;

export class NotifiClientError extends Error {
  constructor(public underlying: unknown) {
    super('NotifiClient encountered an error');
  }
}

type InternalData = {
  alerts: Alert[];
  filters: Filter[];
  sources: Source[];
  sourceGroups: SourceGroup[];
  targetGroups: TargetGroup[];
  emailTargets: EmailTarget[];
  smsTargets: SmsTarget[];
  telegramTargets: TelegramTarget[];
};

const fetchDataImpl = async (service: NotifiService): Promise<InternalData> => {
  const [
    alerts,
    sources,
    sourceGroups,
    targetGroups,
    emailTargets,
    smsTargets,
    telegramTargets
  ] = await Promise.all([
    service.getAlerts(),
    service.getSources(),
    service.getSourceGroups(),
    service.getTargetGroups(),
    service.getEmailTargets(),
    service.getSmsTargets(),
    service.getTelegramTargets()
  ]);

  const filterIds = new Set<string | null>();
  const filters: Filter[] = [];
  sources.forEach((source) => {
    source.applicableFilters.forEach((filter) => {
      if (!filterIds.has(filter.id)) {
        filters.push(filter);
        filterIds.add(filter.id);
      }
    });
  });

  return {
    alerts: [...alerts],
    filters,
    sources: [...sources],
    sourceGroups: [...sourceGroups],
    targetGroups: [...targetGroups],
    emailTargets: [...emailTargets],
    smsTargets: [...smsTargets],
    telegramTargets: [...telegramTargets]
  };
};

type CreateFunc<T> = (service: NotifiService, value: string) => Promise<T>;
type IdentifyFunc<T> = (arg: T) => string | null;

const ensureTargetHoc = <T extends Readonly<{ id: string | null }>>(
  create: CreateFunc<T>,
  identify: IdentifyFunc<T>
): ((
  service: NotifiService,
  existing: Array<T> | undefined,
  value: string | null
) => Promise<string | null>) => {
  return async (service, existing, value) => {
    if (value === null) {
      return null;
    }

    const found = existing?.find((it) => identify(it) === value);

    if (found !== undefined) {
      return found.id;
    }

    const created = await create(service, value);
    existing?.push(created);
    return created.id;
  };
};

const ensureEmail = ensureTargetHoc(
  async (service: NotifiService, value: string) =>
    await service.createEmailTarget({
      name: value,
      value
    }),
  (arg: EmailTarget) => arg.emailAddress
);

const ensureSms = ensureTargetHoc(
  async (service: NotifiService, value: string) =>
    await service.createSmsTarget({
      name: value,
      value
    }),
  (arg: SmsTarget) => arg.phoneNumber
);

const ensureTelegram = ensureTargetHoc(
  async (service: NotifiService, value: string) =>
    await service.createTelegramTarget({
      name: value,
      value
    }),
  (arg: TelegramTarget) => arg.telegramId
);

async function ensureTargetIds(
  service: NotifiService,
  newData: InternalData,
  input: Readonly<{
    emailAddress: string | null;
    phoneNumber: string | null;
    telegramId: string | null;
  }>
) {
  const { emailAddress, phoneNumber, telegramId } = input;
  const [emailTargetId, smsTargetId, telegramTargetId] = await Promise.all([
    ensureEmail(service, newData?.emailTargets, emailAddress),
    ensureSms(service, newData?.smsTargets, phoneNumber),
    ensureTelegram(service, newData?.telegramTargets, telegramId)
  ]);

  const emailTargetIds = [];
  if (emailTargetId !== null) {
    emailTargetIds.push(emailTargetId);
  }

  const smsTargetIds = [];
  if (smsTargetId !== null) {
    smsTargetIds.push(smsTargetId);
  }

  const telegramTargetIds = [];
  if (telegramTargetId !== null) {
    telegramTargetIds.push(telegramTargetId);
  }
  return { emailTargetIds, smsTargetIds, telegramTargetIds };
}

const projectData = (internalData: InternalData | null): ClientData | null => {
  if (internalData == null) {
    return null;
  }

  const { alerts, filters, sources, targetGroups } = internalData;

  return {
    alerts,
    filters,
    sources,
    targetGroups
  };
};

/**
 * React hook for Notifi SDK
 *
 * @remarks
 * Used to interact with Notifi services
 *
 * @param config - Options to configure the Notifi client
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
const useNotifiClient = (
  config: NotifiClientConfig
): NotifiClient &
  Readonly<{
    data: ClientData | null;
    error: Error | null;
    loading: boolean;
    isAuthenticated: () => boolean;
  }> => {
  const { env, dappAddress, walletPublicKey } = config;
  const notifiConfig = useNotifiConfig(env);
  const { jwtRef, setJwt } = useNotifiJwt(
    dappAddress,
    walletPublicKey,
    notifiConfig.storagePrefix
  );
  const service = useNotifiService(env, jwtRef);

  const [internalData, setInternalData] = useState<InternalData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * User's stored preferences for email, sms, etc.
   * @typedef {object} ClientData
   * @property {string | null} email - Email address for Alert notifications
   * @property {string | null} phoneNumber - Phone number for Alert notifications
   * @property {string | null} telegramId - Telegram username for Alert notifications
   *
   */

  /**
   * Fetch user's stored values from Notifi
   *
   * @remarks
   * Obtains the stored values for a user's Alert, Targets, Sources, etc.
   *
   * @returns {ClientData} User's stored values
   * <br>
   * <br>
   * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const newData = await fetchDataImpl(service);
      setInternalData(newData);

      const clientData = projectData(newData);
      if (clientData === null) {
        throw new Error('Unknown error');
      }

      return clientData;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new NotifiClientError(e));
      }
      throw e;
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    // Initial load
    if (jwtRef.current !== null) {
      setLoading(true);
      fetchDataImpl(service)
        .then((newData) => {
          setInternalData(newData);
          setLoading(false);
        })
        .catch((_e: unknown) => {
          // Sign out
          setJwt(null);
          setLoading(false);
        });
    }
  }, [jwtRef.current]);

  /**
   * Authorization object containing token and metadata
   * @typedef {object} Authorization
   * @property {string | null} token - Authorization token
   * @property {string | null} expiry - Token expiry in ISO 8601-1:2019 format
   *
   */

  /**
   * User's object describing the user account
   * @typedef {object} User
   * @property {string | null} email - Email address associated with account. For dapp logins, the email is auto assigned, but can be changed later
   * @property {boolean} emailConfirmed - Is the account in confirmed? Only confirmed accounts can interact with Notifi
   *
   */

  /**
   * Log in to Notifi
   *
   * @remarks
   * Log in to Notif and obtain security context for future calls to set/retrieve account data
   *
   * @returns {ClientData} User's stored values
   * <br>
   * <br>
   * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
   */
  const logIn = useCallback(
    async (signer: MessageSigner) => {
      if (signer == null) {
        throw new Error('Signer cannot be null');
      }

      const timestamp = Math.round(Date.now() / 1000);

      setLoading(true);
      try {
        const messageBuffer = new TextEncoder().encode(
          `${walletPublicKey}${dappAddress}${timestamp.toString()}`
        );
        const signedBuffer = await signer.signMessage(messageBuffer);
        const signature = Buffer.from(signedBuffer).toString('base64');
        const result = await service.logInFromDapp({
          walletPublicKey,
          dappAddress,
          timestamp,
          signature
        });

        const newToken = result.authorization?.token ?? null;
        jwtRef.current = newToken;
        service.setJwt(newToken);
        setJwt(newToken);

        const newData = await fetchDataImpl(service);
        setInternalData(newData);

        return result;
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new NotifiClientError(e));
        }
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [service, walletPublicKey, dappAddress]
  );

  /**
   * Update an Alert
   *
   * @remarks
   * Use this to allow the user to update Alerts
   *
   * @param {ClientUpdateAlertInput} input - Input params for updating an Alert
   * @returns {UserAlert} An Alert object owned by the user
   * <br>
   * <br>
   * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
   */
  const updateAlert = useCallback(
    async (input: ClientUpdateAlertInput): Promise<Alert> => {
      const { alertId } = input;

      setLoading(true);
      try {
        const newData = await fetchDataImpl(service);
        const { emailTargetIds, smsTargetIds, telegramTargetIds } =
          await ensureTargetIds(service, newData, input);

        const existingAlert = newData.alerts.find((a) => a.id === alertId);
        if (existingAlert === undefined) {
          throw new Error(`Unable to find alert ${alertId}`);
        }

        const targetGroupId = existingAlert.targetGroup.id;
        if (targetGroupId === null) {
          throw new Error(`No Target Group for alert ${alertId}`);
        }

        const targetGroupName = existingAlert.targetGroup.name;
        if (targetGroupName === null) {
          throw new Error(`Invalid Target Group on alert ${alertId}`);
        }

        const targetGroup = await service.updateTargetGroup({
          id: targetGroupId,
          name: targetGroupName,
          emailTargetIds,
          smsTargetIds,
          telegramTargetIds
        });

        const alertIndex = newData.alerts.indexOf(existingAlert);
        newData.alerts[alertIndex] = {
          ...existingAlert,
          targetGroup
        };

        const targetGroupIndex = newData.targetGroups.findIndex(
          (t) => t.id === targetGroupId
        );
        newData.targetGroups[targetGroupIndex] = targetGroup;
        setInternalData(newData);
        return existingAlert;
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new NotifiClientError(e));
        }
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  /**
   * Create an Alert
   *
   * @remarks
   * Use this to allow the user to create Alerts
   *
   * @param {ClientCreateAlertInput} input - Input params for creating an Alert
   * @returns {UserAlert} An Alert object owned by the user
   * <br>
   * <br>
   * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
   */
  const createAlert = useCallback(
    async (input: ClientCreateAlertInput): Promise<Alert> => {
      const { name, filterId, filterOptions = {}, sourceId } = input;

      setLoading(true);
      try {
        const newData = await fetchDataImpl(service);
        const { emailTargetIds, smsTargetIds, telegramTargetIds } =
          await ensureTargetIds(service, newData, input);

        const existingAlert = newData.alerts.find((a) => a.name === name);
        if (existingAlert !== undefined) {
          throw new Error(
            `Name must be unique! Found alert ${existingAlert.id} with name ${name}`
          );
        }

        const sourceToUse = newData.sources.find((s) => s.id === sourceId);
        if (sourceToUse === undefined) {
          throw new Error(`Invalid source id ${sourceId}`);
        }

        const existingFilter = sourceToUse.applicableFilters.find(
          (f) => f.id === filterId
        );
        if (existingFilter === undefined) {
          throw new Error(`Invalid filter id ${filterId}`);
        }

        const [sourceGroup, targetGroup] = await Promise.all([
          service.createSourceGroup({
            name,
            sourceIds: [sourceId]
          }),
          service.createTargetGroup({
            name,
            emailTargetIds,
            smsTargetIds,
            telegramTargetIds
          })
        ]);

        newData.sourceGroups.push(sourceGroup);
        newData.targetGroups.push(targetGroup);

        const sourceGroupId = sourceGroup.id;
        if (sourceGroupId === null) {
          throw new Error(`Unknown error creating source group`);
        }

        const targetGroupId = targetGroup.id;
        if (targetGroupId === null) {
          throw new Error(`Unknown error creating target group`);
        }

        const alert = await service.createAlert({
          name,
          sourceGroupId,
          filterId,
          filterOptions: JSON.stringify(filterOptions),
          targetGroupId
        });

        newData.alerts.push(alert);

        setInternalData(newData);
        return alert;
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new NotifiClientError(e));
        }
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  /**
   * Delete an Alert
   *
   * @remarks
   * Use this to allow the user to delete Alerts
   *
   * @param {@link ClientDeleteAlertInput} input - Input params for deleting an Alert
   * @returns {string} The processed ID
   * <br>
   * <br>
   * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
   */
  const deleteAlert = useCallback(
    async (input: ClientDeleteAlertInput) => {
      const { alertId } = input;
      try {
        const newData = await fetchDataImpl(service);
        const alertToDelete = newData.alerts.find((a) => {
          a.id === alertId;
        });
        if (alertToDelete === undefined) {
          throw new Error(`Unknown alert id ${alertId}`);
        }

        const targetGroupId = alertToDelete.targetGroup.id;
        const sourceGroupId = alertToDelete.sourceGroup.id;

        await service.deleteAlert({ id: alertId });

        newData.alerts = newData.alerts.filter((a) => a !== alertToDelete);

        let deleteTargetGroupPromise = Promise.resolve();
        if (targetGroupId !== null) {
          deleteTargetGroupPromise = service
            .deleteTargetGroup({
              id: targetGroupId
            })
            .then(() => {
              newData.targetGroups = newData.targetGroups.filter(
                (t) => t.id !== targetGroupId
              );
            });
        }

        let deleteSourceGroupPromise = Promise.resolve();
        if (sourceGroupId !== null) {
          deleteSourceGroupPromise = service
            .deleteSourceGroup({
              id: sourceGroupId
            })
            .then(() => {
              newData.sourceGroups = newData.sourceGroups.filter(
                (s) => s.id !== sourceGroupId
              );
            });
        }

        await Promise.all([deleteTargetGroupPromise, deleteSourceGroupPromise]);

        return alertId;
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new NotifiClientError(e));
        }
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  /**
   * Is client SDK authenticated?
   *
   * @remarks
   * This will signal if client SDK is currently in an authenticated state. If true, it is safe to call methods for account updates/retrieval.
   * If this is false, logIn method must be called and successful.
   *
   * @returns {boolean} An Alert object owned by the user
   */
  const isAuthenticated = useCallback(() => {
    return jwtRef.current !== null;
  }, [jwtRef]);

  const data = useMemo(() => {
    return projectData(internalData);
  }, [internalData]);

  const client: NotifiClient = {
    logIn,
    createAlert,
    deleteAlert,
    fetchData,
    updateAlert
  };

  return {
    data,
    error,
    isAuthenticated,
    loading,
    ...client
  };
};

export default useNotifiClient;
