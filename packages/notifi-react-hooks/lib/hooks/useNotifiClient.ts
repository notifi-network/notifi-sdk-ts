import type { NotifiEnvironment } from '@notifi-network/notifi-axios-utils';
import {
  Alert,
  BeginLoginViaTransactionResult,
  ClientBroadcastMessageInput,
  ClientConfiguration,
  ClientCreateAlertInput,
  ClientCreateBonfidaAuctionSourceInput,
  ClientCreateMetaplexAuctionSourceInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientEnsureTargetGroupInput,
  ClientFetchSubscriptionCardInput,
  ClientSendVerificationEmailInput,
  ClientUpdateAlertInput,
  CompleteLoginViaTransactionInput,
  CompleteLoginViaTransactionResult,
  CreateSourceInput,
  MessageSigner,
  NotifiClient,
  Source,
  TargetGroup,
  TargetType,
  TenantConfig,
  User,
  UserTopic,
} from '@notifi-network/notifi-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ensureSource, {
  ensureBonfidaAuctionSource,
  ensureMetaplexAuctionSource,
} from '../utils/ensureSource';
import ensureSourceGroup from '../utils/ensureSourceGroup';
import ensureTargetGroupImpl from '../utils/ensureTargetGroup';
import ensureTargetIds from '../utils/ensureTargetIds';
import fetchDataImpl, {
  FetchDataState,
  InternalData,
} from '../utils/fetchDataImpl';
import packFilterOptions from '../utils/packFilterOptions';
import storage from '../utils/storage';
import useNotifiConfig, { BlockchainEnvironment } from './useNotifiConfig';
import useNotifiService from './useNotifiService';

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
  walletBlockchain: 'SOLANA' | 'ETHEREUM';
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

  const {
    alerts,
    emailTargets,
    filters,
    smsTargets,
    sources,
    targetGroups,
    telegramTargets,
  } = internalData;

  return {
    alerts,
    emailTargets,
    filters,
    smsTargets,
    sources,
    targetGroups,
    telegramTargets,
  };
};

// Don't split this line into multiple lines due to some packagers or other build modules that
// modify the string literal, which then causes authentication to fail due to different strings
export const SIGNING_MESSAGE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy. \n`;

const signMessage = async ({
  walletBlockchain,
  walletPublicKey,
  dappAddress,
  signer,
  timestamp,
}: Readonly<{
  walletBlockchain: NotifiClientConfig['walletBlockchain'];
  walletPublicKey: string;
  dappAddress: string;
  signer: MessageSigner;
  timestamp: number;
}>): Promise<string> => {
  const messageBuffer = new TextEncoder().encode(
    `${SIGNING_MESSAGE} \n 'Nonce:' ${walletPublicKey}${dappAddress}${timestamp.toString()}`,
  );

  const signedBuffer = await signer.signMessage(messageBuffer);
  let encoding: BufferEncoding = 'base64';
  if (walletBlockchain === 'ETHEREUM') {
    encoding = 'hex';
  }
  const signature = Buffer.from(signedBuffer).toString(encoding);
  return signature;
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
  const { env, dappAddress, walletPublicKey, walletBlockchain } = config;
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const notifiConfig = useNotifiConfig(env);
  const { getAuthorization, getRoles, setAuthorization, setRoles } =
    useMemo(() => {
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
  const clientRandomUuid = useRef<string | null>(null);

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

  const handleLogInResult = useCallback(
    async (result: User) => {
      if (result.authorization !== null) {
        const { token, expiry } = result.authorization;
        if (token !== null && expiry !== null) {
          service.setJwt(token);
          setAuthorization({ token, expiry });
        }
      }

      if (result.roles !== null) {
        setRoles(result.roles);
      } else {
        setRoles(null);
      }

      const newData = await fetchDataImpl(service, Date, fetchDataRef.current);
      setInternalData(newData);
      setIsAuthenticated(true);
    },
    [
      service,
      fetchDataRef,
      setAuthorization,
      setRoles,
      fetchDataImpl,
      setInternalData,
      setIsAuthenticated,
    ],
  );

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
        const signature = await signMessage({
          walletBlockchain,
          walletPublicKey,
          dappAddress,
          timestamp,
          signer,
        });
        const result = await service.logInFromDapp({
          walletPublicKey,
          dappAddress,
          timestamp,
          signature,
          walletBlockchain,
        });

        console.log('handleLogInResult', result);
        await handleLogInResult(result);

        return result;
      } catch (e: unknown) {
        setIsAuthenticated(false);
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
    [
      setAuthorization,
      setRoles,
      service,
      walletPublicKey,
      dappAddress,
      walletBlockchain,
    ],
  );

  /**
   * Begin login process leveraging inserting a token in the logs of a transaction
   *
   * @Remarks Call this before starting your transaction to obtain the log string to insert
   *
   * @returns {BeginLoginViaTransactionResult} Contains log string to include in transaction
   */
  const beginLoginViaTransaction =
    useCallback(async (): Promise<BeginLoginViaTransactionResult> => {
      setLoading(true);
      try {
        const result = await service.beginLogInByTransaction({
          walletAddress: walletPublicKey,
          walletBlockchain: 'SOLANA',
          dappAddress,
        });

        if (result.nonce !== null) {
          const ruuid = window.crypto.randomUUID();
          const encoder = new TextEncoder();
          const data = encoder.encode(result.nonce + ruuid);
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const logValue =
            'Notifi Auth: 0x' +
            hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
          clientRandomUuid.current = ruuid;
          const retVal: BeginLoginViaTransactionResult = {
            logValue: logValue,
          };

          return retVal;
        }

        throw 'Failed to begin login process';
      } catch (e: unknown) {
        setIsAuthenticated(false);
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new NotifiClientError(e));
        }
        throw e;
      } finally {
        setLoading(false);
      }
    }, [
      setLoading,
      setIsAuthenticated,
      setError,
      window.crypto,
      service,
      walletPublicKey,
      dappAddress,
    ]);

  /**
   * Complete login process leveraging inserting a token in the logs of a transaction
   *
   * @Remarks Call this right after your transaction with the transaction signature
   *
   * @param {CompleteLoginViaTransactionInput} input - Input params completing the transaction login
   * @returns {CompleteLoginViaTransactionResult} Contains the User auth object
   */
  const completeLoginViaTransaction = useCallback(
    async (
      input: CompleteLoginViaTransactionInput,
    ): Promise<CompleteLoginViaTransactionResult> => {
      const { transactionSignature } = input;

      setLoading(true);
      try {
        if (!clientRandomUuid.current) {
          throw 'BeginLoginViaTransaction is required to be called first';
        }

        const result = await service.completeLogInByTransaction({
          walletAddress: walletPublicKey,
          walletBlockchain: 'SOLANA',
          dappAddress,
          randomUuid: clientRandomUuid.current,
          transactionSignature,
        });

        await handleLogInResult(result);

        return result;
      } catch (e: unknown) {
        setIsAuthenticated(false);
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new NotifiClientError(e));
        }
        throw e;
      } finally {
        clientRandomUuid.current = null;
        setLoading(false);
      }
    },
    [
      setLoading,
      handleLogInResult,
      setIsAuthenticated,
      setError,
      service,
      dappAddress,
      clientRandomUuid,
      walletPublicKey,
    ],
  );

  /**
   * Creates or updates a TargetGroup by name
   *
   * @remarks
   * In most cases the TargetGroups are updated when creating or updating Alerts @see createAlert and @see updateAlert
   * @self should be used only when it's necessary to update the targets without creating Alerts
   *
   * @param {ClientEnsureTargetGroupInput} input - Input params for the TargetGroup
   * @returns {TargetGroup}
   */
  const ensureTargetGroup = useCallback(
    async (input: ClientEnsureTargetGroupInput): Promise<TargetGroup> => {
      setLoading(true);

      try {
        const newData = await fetchDataImpl(
          service,
          Date,
          fetchDataRef.current,
        );

        const {
          emailTargetIds,
          smsTargetIds,
          telegramTargetIds,
          webhookTargetIds,
        } = await ensureTargetIds(service, newData, input);

        const targetGroup = await ensureTargetGroupImpl(
          service,
          newData.targetGroups,
          {
            name: input.name,
            emailTargetIds,
            smsTargetIds,
            telegramTargetIds,
            webhookTargetIds,
          },
        );

        setInternalData(newData);
        return targetGroup;
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
    [setLoading],
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
        const {
          emailTargetIds,
          smsTargetIds,
          telegramTargetIds,
          webhookTargetIds,
        } = await ensureTargetIds(service, newData, input);

        const existingAlert = newData.alerts.find((a) => a.id === alertId);
        if (existingAlert === undefined) {
          throw new Error(`Unable to find alert ${alertId}`);
        }
        const name = existingAlert.name;
        if (name === null) {
          throw new Error(`Invalid Alert ${alertId}`);
        }

        const targetGroup = await ensureTargetGroupImpl(
          service,
          newData.targetGroups,
          {
            name,
            emailTargetIds,
            smsTargetIds,
            telegramTargetIds,
            webhookTargetIds,
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
        targetGroupName,
      } = input;

      setLoading(true);
      try {
        const newData = await fetchDataImpl(
          service,
          Date,
          fetchDataRef.current,
        );
        const {
          emailTargetIds,
          smsTargetIds,
          telegramTargetIds,
          webhookTargetIds,
        } = await ensureTargetIds(service, newData, input);

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
        const targetGroup = await ensureTargetGroupImpl(
          service,
          newData.targetGroups,
          {
            name: targetGroupName ?? name,
            emailTargetIds,
            smsTargetIds,
            telegramTargetIds,
            webhookTargetIds,
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
   * Create a Bonfida Auction Source
   *
   * @remarks
   * Use this to allow the user to create a Source object that emits events from Bonfida auctions
   *
   * @param {ClientCreateBonfidaAuctionSourceInput} input - Input params for creating a Bonfida Auction Source
   * @returns {Source} A Source object that can be used to create an Alert
   * <br>
   * <br>
   * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
   */
  const createBonfidaAuctionSource = useCallback(
    async (input: ClientCreateBonfidaAuctionSourceInput): Promise<Source> => {
      setLoading(true);
      try {
        const newData = await fetchDataImpl(
          service,
          Date,
          fetchDataRef.current,
        );
        const source = await ensureBonfidaAuctionSource(
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

  const logOut = useCallback(async (): Promise<void> => {
    service.setJwt(null);
    await setAuthorization(null);
    await setRoles(null);
    setIsAuthenticated(false);
    setInternalData(null);
  }, [
    setAuthorization,
    setIsAuthenticated,
    setInternalData,
    setRoles,
    service,
  ]);

  const getTopics = useCallback(async (): Promise<ReadonlyArray<UserTopic>> => {
    setLoading(true);
    try {
      const roles = await getRoles();
      const isUserMessenger =
        roles?.some((role) => role === 'UserMessenger') ?? false;
      if (!isUserMessenger) {
        throw new NotifiClientError(
          'This user is not authorized for getTopics!',
        );
      }

      return await service.getTopics();
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
  }, [setLoading, getRoles, service, setError]);

  const data = useMemo(() => {
    return projectData(internalData);
  }, [internalData]);

  const broadcastMessage = useCallback(
    async (
      {
        topic,
        subject,
        message,
        isHolderOnly,
        variables: extraVariables,
      }: ClientBroadcastMessageInput,
      signer: MessageSigner,
    ): Promise<string | null> => {
      setLoading(true);
      try {
        if (topic.topicName === null) {
          throw new NotifiClientError('Invalid UserTopic');
        }

        let targetTemplates;
        if (topic.targetTemplate !== null) {
          const value = topic.targetTemplate;
          targetTemplates = [
            {
              key: 'EMAIL' as TargetType,
              value,
            },
            {
              key: 'SMS' as TargetType,
              value,
            },
            {
              key: 'TELEGRAM' as TargetType,
              value,
            },
          ];
        }

        const timestamp = Math.round(Date.now() / 1000);

        const variables = [
          {
            key: 'message',
            value: message,
          },
          {
            key: 'subject',
            value: subject,
          },
        ];

        if (isHolderOnly && topic.targetCollections !== null) {
          variables.push({
            key: 'TargetCollection',
            value: JSON.stringify(topic.targetCollections),
          });
        }

        if (extraVariables !== undefined) {
          Object.keys(extraVariables).forEach((key) => {
            if (
              key === 'message' ||
              key === 'subject' ||
              key === 'TargetCollection'
            ) {
              return; // forEach
            }
            variables.push({
              key,
              value: extraVariables[key],
            });
          });
        }

        const signature = await signMessage({
          walletBlockchain,
          walletPublicKey,
          dappAddress,
          timestamp,
          signer,
        });
        const result = await service.broadcastMessage({
          topicName: topic.topicName,
          targetTemplates,
          timestamp,
          variables,
          walletBlockchain: 'OFF_CHAIN',
          signature,
        });

        return result.id ?? null;
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
    [setLoading, service],
  );

  const sendEmailTargetVerification: (
    input: ClientSendVerificationEmailInput,
  ) => Promise<string> = useCallback(
    async ({ targetId }) => {
      setLoading(true);
      try {
        const emailTarget = await service.sendEmailTargetVerificationRequest({
          targetId,
        });

        const id = emailTarget.id;
        if (id === null) {
          throw new Error(`Unknown error requesting verification`);
        }
        return id;
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
    [setError, setLoading, service],
  );

  const fetchSubscriptionCard = useCallback(
    async (input: ClientFetchSubscriptionCardInput): Promise<TenantConfig> => {
      console.log('fetchSubscriptionCard', input);
      setLoading(true);
      try {
        const config = await service.findTenantConfig({
          ...input,
          type: 'SUBSCRIPTION_CARD',
        });
        console.log('fetchSubscriptionCard config', config);

        return config;
      } catch (e: unknown) {
        console.log('fetchSubscriptionCard error', e);
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
    [setError, setLoading, service],
  );

  const client: NotifiClient = {
    beginLoginViaTransaction,
    broadcastMessage,
    completeLoginViaTransaction,
    logIn,
    logOut,
    createAlert,
    createBonfidaAuctionSource,
    createMetaplexAuctionSource,
    createSource,
    deleteAlert,
    fetchData,
    fetchSubscriptionCard,
    getConfiguration,
    getTopics,
    updateAlert,
    ensureTargetGroup,
    sendEmailTargetVerification,
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
