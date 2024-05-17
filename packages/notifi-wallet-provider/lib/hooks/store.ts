export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

// Represents the structure of an Ethereum provider based on the EIP-1193 standard.
export interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void,
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void,
  ) => void;
  request: (request: {
    method: string;
    params?: Array<unknown>;
  }) => Promise<unknown>;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

// This type represents the structure of an event dispatched by a wallet to announce its presence based on EIP-6963.
export type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo;
    provider: EIP1193Provider;
  };
};

declare global {
  interface WindowEventMap {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    'eip6963:announceProvider': CustomEvent;
  }
}

let providers: EIP6963ProviderDetail[] = [];
export const store = {
  value: () => providers,
  subscribe: (callback: () => void) => {
    function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
      if (providers.map((p) => p.info.uuid).includes(event.detail.info.uuid))
        return;
      providers = [...providers, event.detail];
      callback();
    }
    window.addEventListener('eip6963:announceProvider', onAnnouncement);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () =>
      window.removeEventListener('eip6963:announceProvider', onAnnouncement);
  },
};
