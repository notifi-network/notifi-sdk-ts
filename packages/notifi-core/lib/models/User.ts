import type { Authorization } from './Authorization';

export type User = Readonly<{
  email: string | null;
  emailConfirmed: boolean;
  authorization: Authorization | null;
  roles: ReadonlyArray<string> | null;
}>;
