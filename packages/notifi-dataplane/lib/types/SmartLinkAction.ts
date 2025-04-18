/* ⬇ Only use type of `frontend-client` pkg, no need to list it on package.json dependency list to avoid circle dependency issue */
import type { AuthParams } from '@notifi-network/notifi-frontend-client';

/* ⬇ Only use type of `graphql` pkg, but need to ensure `notifi-graphql` pkg is build before `dataplane` pkg. So, list `notifi-graphql` pkg on package.json dev dependency list */
import type { Types } from '@notifi-network/notifi-graphql';

/* Input type for ActivateSmartLinkAction */
export type ActivateSmartLinkActionInput = {
  smartLinkId: string;
  actionId: string;
  authParams: AuthParams;
  inputs: Record<number, SmartLinkActionUserInput>;
};
export type SmartLinkActionUserInput = ActionInputTextBox | ActionInputCheckBox;

type ActionInputBase = {
  id: string;
};

type ActionInputTextBox = ActionInputBase & {
  type: 'TEXTBOX';
  value: string | number;
};
type ActionInputCheckBox = ActionInputBase & {
  type: 'CHECKBOX';
  value: boolean;
};

/* Response type for ActivateSmartLinkAction */
// TODO: TBD ⚠️ How to handle html??
export type ActivateSmartLinkActionResponse = {
  successMessage: string;
  failureMessage: string;
  transactions?: [BlockchainTransaction];
};

type BlockchainTransaction = {
  blockchainType: Types.BlockchainType;
  UnsignedTransaction: string;
};

/* Validators */

export const isActivateSmartLinkActionResponse = (
  response: unknown,
): response is ActivateSmartLinkActionResponse => {
  if (typeof response !== 'object' || response === null) {
    return false;
  }
  if ('transactions' in response && !Array.isArray(response.transactions)) {
    return false;
  }
  const { successMessage, failureMessage } =
    response as ActivateSmartLinkActionResponse;

  return (
    typeof successMessage === 'string' && typeof failureMessage === 'string'
  );
};
