export type User = Readonly<{
  email: string | null;
  emailConfirmed: boolean;
  authorization: Readonly<{
    token: string | null;
    expiry: string | null;
  }> | null;
}>;
