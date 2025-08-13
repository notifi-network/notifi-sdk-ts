const coinbaseEndpoint = 'https://broadcast.coinbase.com/api/rpc';

interface PubKey {
  readonly type: string;
  readonly value: string;
}
interface StdSignature {
  readonly pub_key: PubKey;
  readonly signature: string;
}

export type SubscribeMessageType = {
  address: string;
  isActivatedViaCb: boolean;
  nonce: string;
  partnerAddress: string;
  signature: `0x${string}` | StdSignature;
  conversationTopic: string;
};

export const createCoinbaseNonce = async () => {
  const { result } = await fetch(`${coinbaseEndpoint}/createNonce`, {
    method: 'POST',
  }).then((v) => v.json());

  return result?.nonce as string;
};

export const subscribeCoinbaseMessaging = async (
  payload: SubscribeMessageType,
) => {
  const response = await fetch(`${coinbaseEndpoint}/messaging/subscribe`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'text/plain',
    },
  });

  return await response.json();
};
