import { Alert, SourceGroup, TargetGroup, User } from './models';

export type ClientData = Readonly<{
  alerts: ReadonlyArray<Alert>;
  sourceGroups: ReadonlyArray<SourceGroup>;
  targetGroups: ReadonlyArray<TargetGroup>;
}>;

/**
 * Input param for updating an Alert
 *
 * @remarks
 * This describes the Alert to be updated based on id, emailAddress, phoneNumber and/or telegramId
 *
 * @property alertId - The alert to modify
 * @property emailAddress - The emailAddress to be used
 * @property phoneNumber - The phone number to be used
 * @property telegramId - The Telegram account username to be used
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type ClientUpdateAlertInput = Readonly<{
  alertId: string;
  emailAddress: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
}>;

/**
 * Input param for creating an Alert
 *
 * @remarks
 * This describes the Alert to be created based on name, emailAddress, phoneNumber and/or telegramId
 *
 * @property name - Friendly name (must be unique)
 * @property sourceGroupId - The SourceGroup to associate
 * @property filterId - The Filter to associate
 * @property emailAddress - The emailAddress to be used
 * @property phoneNumber - The phone number to be used
 * @property telegramId - The Telegram account username to be used
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type ClientCreateAlertInput = Readonly<{
  name: string;
  sourceGroupId: string;
  filterId: string;
  filterOptions?: FilterOptions;
  emailAddress: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
}>;

export type EmptyFilterOptions = Record<never, never>;
export type ThresholdFilterOptions = Readonly<{
  threshold: number;
}>;
export type FilterOptions = EmptyFilterOptions | ThresholdFilterOptions;

export type ClientDeleteAlertInput = Readonly<{
  alertId: string;
}>;

export type MessageSigner = Readonly<{
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}>;

export type NotifiClient = Readonly<{
  fetchData: () => Promise<ClientData>;
  logIn: (signer: MessageSigner) => Promise<User>;
  createAlert: (input: ClientCreateAlertInput) => Promise<Alert>;
  deleteAlert: (input: ClientDeleteAlertInput) => Promise<string>;
  updateAlert: (input: ClientUpdateAlertInput) => Promise<Alert>;
}>;
