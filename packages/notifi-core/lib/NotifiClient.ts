import { TargetGroup, User } from './models';

export type ClientData = Readonly<{
  emailAddress: string | null;
  phoneNumber: string | null;
  telegramId: string | null;
}>;

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
