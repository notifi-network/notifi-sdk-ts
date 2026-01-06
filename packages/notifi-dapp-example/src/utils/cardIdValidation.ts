import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';

export const validateCardId = (cardId: string | null): boolean => {
  if (!cardId) return false;

  if (cardId.trim() === '') return false;

  if (cardId.length < 10) return false;

  const hasOnlyValidChars = /^[a-zA-Z0-9_-]+$/.test(cardId);
  if (!hasOnlyValidChars) return false;

  return true;
};

export const sanitizeCardId = (cardId: string | null): string | undefined => {
  if (!cardId) return undefined;

  const isValid = validateCardId(cardId);

  if (!isValid) {
    console.warn(
      `Invalid cardId detected in URL: "${cardId}". Falling back to default.`,
    );
    return undefined;
  }

  return cardId;
};

export const validateCardIdExists = async (
  cardId: string,
  tenantId: string,
  env: NotifiEnvironment,
): Promise<boolean> => {
  const graphqlEndpoint =
    env === 'Production'
      ? 'https://api.notifi.network/gql'
      : 'https://api.stage.notifi.network/gql';

  const query = `
    query findTenantConfig($input: FindTenantConfigInput!) {
      findTenantConfig(findTenantConfigInput: $input) {
        id
      }
    }
  `;

  try {
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            tenant: tenantId,
            id: cardId,
            type: 'SUBSCRIPTION_CARD',
          },
        },
      }),
    });

    const result = await response.json();

    if (result.errors || !result.data?.findTenantConfig) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating cardId:', error);
    return false;
  }
};
