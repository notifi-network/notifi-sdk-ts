export type DestinationInputs = Record<FormField, string>;
export type FormField = 'email' | 'phoneNumber' | 'telegram';

export type EditFormType = {
  field: FormField;
  value: string;
};
