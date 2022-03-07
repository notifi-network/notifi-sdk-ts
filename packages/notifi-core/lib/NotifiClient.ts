import { TargetGroup, User } from './models';

export type ClientData = Readonly<{
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
 * @property emailAddress - The emailAddress to be used
 * @property phoneNumber - The phone number to be used
 * @property telegramId - The Telegram account username to be used
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type UpdateAlertInput = Readonly<{
  name: string;
  emailAddress: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
}>;

export type MessageSigner = Readonly<{
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}>;

export type NotifiClient = Readonly<{
  fetchData: () => Promise<ClientData>;
  logIn: (signer: MessageSigner) => Promise<User>;
  updateAlert: (input: UpdateAlertInput) => Promise<TargetGroup>;
}>;
