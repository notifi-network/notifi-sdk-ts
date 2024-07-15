import { CyHttpMessages } from 'cypress/types/net-stubbing';

// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  const { body } = req;
  return (
    Object.prototype.hasOwnProperty.call(body, 'operationName') &&
    body.operationName === operationName
  );
};

// Alias query if operationName matches
export const aliasQuery = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${
      operationName.charAt(0).toUpperCase() + operationName.slice(1)
    }Query`;
  }
};

// Alias mutation if operationName matches
export const aliasMutation = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${
      operationName.charAt(0).toUpperCase() + operationName.slice(1)
    }Mutation`;
  }
};
