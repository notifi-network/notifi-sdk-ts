import ensureSource, {
  ensureMetaplexAuctionSource,
} from '../utils/ensureSource';
import ensureSourceGroup from '../utils/ensureSourceGroup';
import ensureTargetGroup from '../utils/ensureTargetGroup';
import ensureTargetIds from '../utils/ensureTargetIds';
import fetchDataImpl, {
  FetchDataState,
  InternalData,
} from '../utils/fetchDataImpl';
import packFilterOptions from '../utils/packFilterOptions';
import storage from '../utils/storage';
import useNotifiConfig, { BlockchainEnvironment } from './useNotifiConfig';
import useNotifiService from './useNotifiService';
import type { NotifiEnvironment } from '@notifi-network/notifi-axios-utils';
import {
  Alert,
  ClientConfiguration,
  ClientCreateAlertInput,
  ClientCreateMetaplexAuctionSourceInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientUpdateAlertInput,
  CreateSourceInput,
  MessageSigner,
  NotifiClient,
  Source,
} from '@notifi-network/notifi-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  env?: BlockchainEnvironment | NotifiEnvironment;
}>;

export class NotifiClientError extends Error {
  constructor(public underlying: unknown) {
    super('NotifiClient encountered an error');
  }
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
    targetGroups,
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
  config: NotifiClientConfig,
): NotifiClient &
  Readonly<{
    data: ClientData | null;
    error: Error | null;
    loading: boolean;
    isAuthenticated: boolean;
    isInitialized: boolean;
    expiry: string | null;
  }> => {
  const { env, dappAddress, walletPublicKey } = config;
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const notifiConfig = useNotifiConfig(env);
  const { getAuthorization, setAuthorization } = useMemo(() => {
    return storage({
      dappAddress,
      walletPublicKey,
      jwtPrefix: notifiConfig.storagePrefix,
    });
  }, [dappAddress, walletPublicKey, notifiConfig.storagePrefix]);

  const service = useNotifiService(env);

  const [internalData, setInternalData] = useState<InternalData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [expiry, setExpiry] = useState<string | null>(null);

  const fetchDataRef = useRef<FetchDataState>({});

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
      const newData = await fetchDataImpl(service, Date, fetchDataRef.current);
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
    const doInitialLoad = async () => {
      const authorization = await getAuthorization();
      if (authorization === null) {
        setIsAuthenticated(false);
        setIsInitialized(true);
        setExpiry(null);
        return;
      }

      const { token, expiry } = authorization;
      service.setJwt(token);

      const expiryDate = new Date(expiry);
      const now = new Date();
      if (expiryDate <= now) {
        setIsAuthenticated(false);
        setIsInitialized(true);
        setExpiry(expiry);
        return;
      }

      // Refresh if less than a week remaining
      const refreshTime = new Date();
      refreshTime.setDate(refreshTime.getDate() + 7);
      if (expiryDate < refreshTime) {
        try {
          const { token: newToken, expiry: newExpiry } =
            await service.refreshAuthorization();
          if (newToken !== null && newExpiry !== null) {
            service.setJwt(newToken);
            setAuthorization({ token: newToken, expiry: newExpiry });
            setIsAuthenticated(true);
            setExpiry(newExpiry);
          }
        } catch (_e: unknown) {
          // Explicity ignore refresh errors
          setExpiry(expiry);
          setIsAuthenticated(true);
        }
      } else {
        setExpiry(expiry);
        setIsAuthenticated(true);
      }

      const newData = await fetchDataImpl(service, Date, fetchDataRef.current);
      setInternalData(newData);
      setLoading(false);
    };

    setIsInitialized(false);
    doInitialLoad()
      .catch((_e: unknown) => {
        // Intentionally ignore
      })
      .then(() => {
        setIsInitialized(true);
      });
  }, [getAuthorization, setAuthorization]);

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
          `${walletPublicKey}${dappAddress}${timestamp.toString()}`,
        );
        const signedBuffer = await signer.signMessage(messageBuffer);
        const signature = Buffer.from(signedBuffer).toString('base64');
        const result = await service.logInFromDapp({
          walletPublicKey,
          dappAddress,
          timestamp,
          signature,
        });

        if (result.authorization !== null) {
          const { token, expiry } = result.authorization;
          if (token !== null && expiry !== null) {
            service.setJwt(token);
            setAuthorization({ token, expiry });
          }
        }

        const newData = await fetchDataImpl(
          service,
          Date,
          fetchDataRef.current,
        );
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
    [service, walletPublicKey, dappAddress],
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
        const newData = await fetchDataImpl(
          service,
          Date,
          fetchDataRef.current,
        );
        const { emailTargetIds, smsTargetIds, telegramTargetIds } =
          await ensureTargetIds(service, newData, input);

        const existingAlert = newData.alerts.find((a) => a.id === alertId);
        if (existingAlert === undefined) {
          throw new Error(`Unable to find alert ${alertId}`);
        }
        const name = existingAlert.name;
        if (name === null) {
          throw new Error(`Invalid Alert ${alertId}`);
        }

        const targetGroup = await ensureTargetGroup(
          service,
          newData.targetGroups,
          {
            name,
            emailTargetIds,
            smsTargetIds,
            telegramTargetIds,
          },
        );

        const alertIndex = newData.alerts.indexOf(existingAlert);
        const newAlert: Alert = {
          ...existingAlert,
          targetGroup,
        };
        newData.alerts[alertIndex] = newAlert;

        setInternalData({
          ...newData,
        });
        return newAlert;
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
    [service],
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
      const {
        name,
        filterId,
        filterOptions,
        sourceId,
        groupName = 'default',
      } = input;

      setLoading(true);
      try {
        const newData = await fetchDataImpl(
          service,
          Date,
          fetchDataRef.current,
        );
        const { emailTargetIds, smsTargetIds, telegramTargetIds } =
          await ensureTargetIds(service, newData, input);

        const existingAlert = newData.alerts.find((a) => a.name === name);
        if (existingAlert !== undefined) {
          throw new Error(
            `Name must be unique! Found alert ${existingAlert.id} with name ${name}`,
          );
        }

        const sourceToUse = newData.sources.find((s) => s.id === sourceId);
        if (sourceToUse === undefined) {
          throw new Error(`Invalid source id ${sourceId}`);
        }

        const existingFilter = sourceToUse.applicableFilters.find(
          (f) => f.id === filterId,
        );
        if (existingFilter === undefined) {
          throw new Error(`Invalid filter id ${filterId}`);
        }

        const sourceGroup = await ensureSourceGroup(
          service,
          newData.sourceGroups,
          {
            name,
            sourceIds: [sourceId],
          },
        );
        const targetGroup = await ensureTargetGroup(
          service,
          newData.targetGroups,
          {
            name,
            emailTargetIds,
            smsTargetIds,
            telegramTargetIds,
          },
        );

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
          filterOptions: packFilterOptions(filterOptions),
          targetGroupId,
          groupName,
        });

        // The returned target group doesn't have individual targets
        // Work around by spreading the known target group
        const newAlert = {
          ...alert,
          sourceGroup,
          targetGroup,
        };

        newData.alerts.push(newAlert);

        setInternalData({ ...newData });
        return newAlert;
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
    [service],
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
      const {
        alertId,
        keepSourceGroup = false,
        keepTargetGroup = false,
      } = input;
      try {
        const newData = await fetchDataImpl(
          service,
          Date,
          fetchDataRef.current,
        );
        const alertToDelete = newData.alerts.find((a) => {
          return a.id === alertId;
        });
        if (alertToDelete === undefined) {
          throw new Error(`Unknown alert id ${alertId}`);
        }

        const targetGroupId = alertToDelete.targetGroup.id;
        const sourceGroupId = alertToDelete.sourceGroup.id;

        await service.deleteAlert({ id: alertId });

        newData.alerts = newData.alerts.filter((a) => a !== alertToDelete);

        if (targetGroupId !== null && !keepTargetGroup) {
          await service
            .deleteTargetGroup({
              id: targetGroupId,
            })
            .then(() => {
              newData.targetGroups = newData.targetGroups.filter(
                (t) => t.id !== targetGroupId,
              );
            });
        }

        if (sourceGroupId !== null && !keepSourceGroup) {
          await service
            .deleteSourceGroup({
              id: sourceGroupId,
            })
            .then(() => {
              newData.sourceGroups = newData.sourceGroups.filter(
                (s) => s.id !== sourceGroupId,
              );
            });
        }

        setInternalData({ ...newData });

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
    [service],
  );

  /**
   * Create a new Source
   *
   * @remarks
   * Use this to allow the user to create a Source object that emits events
   *
   * @param {CreateSourceInput} input - Input params for creating a Source
   * @returns {Source} A Source object that can be used to create an Alert
   * <br>
   * <br>
   * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
   */
  const createSource = useCallback(
    async (input: CreateSourceInput): Promise<Source> => {
      setLoading(true);
      try {
        const newData = await fetchDataImpl(
          service,
          Date,
          fetchDataRef.current,
        );
        const source = await ensureSource(service, newData.sources, input);

        source.applicableFilters.forEach((applicableFilter) => {
          const existing = newData.filters.find(
            (existingFilter) => applicableFilter.id === existingFilter.id,
          );
          if (existing !== undefined) {
            newData.filters.push(applicableFilter);
          }
        });

        setInternalData(newData);
        return source;
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
    [service],
  );

  /**
   * Create a Metaplex Auction Source
   *
   * @remarks
   * Use this to allow the user to create a Source object that emits evevents from Metaplex auctions
   *
   * @param {ClientCreateMetaplexAuctionSourceInput} input - Input params for creating a Metaplex Auction Source
   * @returns {Source} A Source object that can be used to create an Alert
   * <br>
   * <br>
   * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
   */
  const createMetaplexAuctionSource = useCallback(
    async (input: ClientCreateMetaplexAuctionSourceInput): Promise<Source> => {
      setLoading(true);
      try {
        const newData = await fetchDataImpl(
          service,
          Date,
          fetchDataRef.current,
        );
        const source = await ensureMetaplexAuctionSource(
          service,
          newData.sources,
          input,
        );
        setInternalData(newData);
        return source;
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
    [service],
  );

  /**
   * Get the configurations associated with the configured dapp
   *
   * @remarks
   * Use this to determine which Target inputs are supported before a user has authenticated.
   * This also returns the list of country codes that are supported for SMS
   *
   */
  const getConfiguration =
    useCallback(async (): Promise<ClientConfiguration> => {
      setLoading(true);
      try {
        return await service.getConfigurationForDapp({
          dappAddress: config.dappAddress,
        });
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
    }, [config.dappAddress, service]);

  const data = useMemo(() => {
    return projectData(internalData);
  }, [internalData]);

  const client: NotifiClient = {
    logIn,
    createAlert,
    createMetaplexAuctionSource,
    createSource,
    deleteAlert,
    fetchData,
    getConfiguration,
    updateAlert,
  };

  return {
    data,
    error,
    expiry,
    isAuthenticated,
    isInitialized,
    loading,
    ...client,
  };
};

export default useNotifiClient;
