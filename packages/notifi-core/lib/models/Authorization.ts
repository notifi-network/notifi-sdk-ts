export type Authorization = Readonly<{
  token: string | null;
  expiry: string | null;
}>;
