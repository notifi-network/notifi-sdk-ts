export type User = Readonly<{
  email: string | null;
  emailConfirmed: boolean;
  token: string | null;
}>;
