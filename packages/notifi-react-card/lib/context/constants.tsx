export type DestinationInputs = Record<FormField, string>;
export type FormField =
  | 'email'
  | 'phoneNumber'
  | 'telegram'
  | 'discord'
  | 'slack'
  | 'web3';

export type DestinationErrorMessageField = {
  field: FormField;
  value: DestinationError;
};

export type EditFormType = {
  field: FormField;
  value: string;
};

export type RecoverableError = Readonly<{
  type: 'recoverableError';
  message: string;
  onClick: () => void;
  tooltip?: string;
}>;

export type UnrecoverableError = Readonly<{
  type: 'unrecoverableError';
  message: string;
  tooltip?: string;
}>;

export type DestinationError =
  | UnrecoverableError
  | RecoverableError
  | undefined;

export type DestinationErrors = Record<FormField, DestinationError>;
