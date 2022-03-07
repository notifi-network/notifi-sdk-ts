import {
  NotifiClient,
  ClientData,
  UpdateAlertInput,
  NotifiService,
  TargetGroup,
  Filter,
  SourceGroup,
  Alert,
  EmailTarget,
  SmsTarget,
  TelegramTarget,
  MessageSigner
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
  alert: Alert | null;
  filter: Filter | null;
  sourceGroup: SourceGroup | null;
  targetGroup: TargetGroup | null;
  emailTargets: EmailTarget[];
  smsTargets: SmsTarget[];
  telegramTargets: TelegramTarget[];
};

const firstOrNull = <T>(arr: ReadonlyArray<T>): T | null => {
  return arr.length > 0 ? arr[0] : null;
};

const fetchDataImpl = async (service: NotifiService): Promise<InternalData> => {
  const [
    alerts,
    filters,
    sourceGroups,
    targetGroups,
    emailTargets,
    smsTargets,
    telegramTargets
  ] = await Promise.all([
    service.getAlerts(),
    service.getFilters(),
    service.getSourceGroups(),
    service.getTargetGroups(),
    service.getEmailTargets(),
    service.getSmsTargets(),
    service.getTelegramTargets()
  ]);

  const alert = firstOrNull(alerts);

  return {
    alert,
    filter: firstOrNull(filters),
    sourceGroup: firstOrNull(sourceGroups),
    targetGroup: firstOrNull(targetGroups),
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

const projectData = (internalData: InternalData | null): ClientData | null => {
  if (internalData == null) {
    return null;
  }

  const { emailTargets, smsTargets, telegramTargets } =
    internalData.targetGroup ?? {};

  return {
    emailAddress: firstOrNull(emailTargets ?? [])?.emailAddress ?? null,
    phoneNumber: firstOrNull(smsTargets ?? [])?.phoneNumber ?? null,
    telegramId: firstOrNull(telegramTargets ?? [])?.telegramId ?? null
  };
};

/**
 * React hook for Notifi SDK
 * 
 * @remarks
 * Used to interact with Notifi services
 * 
 * @property config - Options to configure the Notifi client
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
        const binaryString = String.fromCharCode(...signedBuffer);
        const signature = btoa(binaryString);
        const result = await service.logInFromDapp({
          walletPublicKey,
          dappAddress,
          timestamp,
          signature
        });

        const newToken = result.authorization?.token ?? null
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
 * Create or update an Alert
 * 
 * @remarks
 * Use this to allow the user to create or update Alerts
 * 
 * @param {UpdateAlertInput} input - Input params for upserting an Alert
 * @returns {UserAlert} An Alert object owned by the user
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
  const updateAlert = useCallback(
    async (input: UpdateAlertInput) => {
      const { name, emailAddress, phoneNumber, telegramId } = input;

      setLoading(true);
      try {
        const newData = await fetchDataImpl(service);
        const [emailTargetId, smsTargetId, telegramTargetId] =
          await Promise.all([
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

        const existingAlert = newData.alert;
        if (existingAlert !== null && existingAlert.targetGroup.id !== null) {
          const result = await service.updateTargetGroup({
            id: existingAlert.targetGroup.id,
            name,
            emailTargetIds,
            smsTargetIds,
            telegramTargetIds
          });

          newData.alert = {
            ...existingAlert,
            targetGroup: result
          };
          newData.targetGroup = result;
          setInternalData(newData);
          return result;
        } else {
          const filterId = newData.filter?.id ?? null;
          const sourceGroupId = newData.sourceGroup?.id ?? null;
          if (filterId === null || sourceGroupId === null) {
            throw new Error('Data is missing. Have you logged in?');
          }

          let result = newData.targetGroup;
          if (result === null || result.id === null) {
            result = await service.createTargetGroup({
              name,
              emailTargetIds,
              smsTargetIds,
              telegramTargetIds
            });
          }
          newData.targetGroup = result;

          const targetGroupId = result.id ?? null;
          if (targetGroupId === null) {
            throw new Error('TargetGroup creation failed');
          }

          const alert = await service.createAlert({
            sourceGroupId,
            filterId,
            targetGroupId
          });
          newData.alert = alert;
          setInternalData(newData);
          return result;
        }
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

  return {
    data,
    error,
    fetchData,
    isAuthenticated,
    logIn,
    loading,
    updateAlert
  };
};

export default useNotifiClient;
