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

export type NotifiClientConfig = Readonly<{
  daoAddress: string;
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

const useNotifiClient = (
  config: NotifiClientConfig
): NotifiClient &
  Readonly<{
    data: ClientData | null;
    error: Error | null;
    loading: boolean;
    isAuthenticated: () => boolean;
  }> => {
  const { env, daoAddress, walletPublicKey } = config;
  const notifiConfig = useNotifiConfig(env);
  const { jwtRef, setJwt } = useNotifiJwt(
    daoAddress,
    walletPublicKey,
    notifiConfig.storagePrefix
  );
  const service = useNotifiService(env, jwtRef);

  const [internalData, setInternalData] = useState<InternalData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const logIn = useCallback(
    async (signer: MessageSigner) => {
      if (signer == null) {
        throw new Error('Signer cannot be null');
      }

      const timestamp = Math.round(Date.now() / 1000);

      setLoading(true);
      try {
        const messageBuffer = new TextEncoder().encode(
          `${walletPublicKey}${daoAddress}${timestamp.toString()}`
        );
        const signedBuffer = await signer.signMessage(messageBuffer);
        const binaryString = String.fromCharCode(...signedBuffer);
        const signature = btoa(binaryString);
        const result = await service.logInFromDao({
          walletPublicKey,
          daoAddress,
          timestamp,
          signature
        });

        jwtRef.current = result.token;
        service.setJwt(result.token);
        setJwt(result.token);

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
    [service, walletPublicKey, daoAddress]
  );

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
