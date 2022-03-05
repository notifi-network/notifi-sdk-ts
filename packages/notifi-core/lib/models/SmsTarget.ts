export type SmsTarget = Readonly<{
  id: string | null;
  isConfirmed: boolean;
  name: string | null;
  phoneNumber: string | null;
}>;
