export type DestinationInputs = {
  email: string;
  phoneNumber: string;
  telegram: string;
};

export type FormField = 'email' | 'phoneNumber' | 'telegram';

export type EditFormType = {
  field: FormField;
  value: string;
};
