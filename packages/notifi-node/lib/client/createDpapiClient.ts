// TODO: Move all of this to an independent package
import {
  EnvironmentConfig,
  NotifiEnvironment,
  notifiConfigs,
} from '@notifi-network/notifi-axios-utils';
import { WalletBlockchain } from '@notifi-network/notifi-core';

export interface FusionMessage {
  eventTypeId: string;
  variablesJson: any;
  specificWallets?: WalletBlockchain[];
}

export interface PublishFusionMessageResponse {
  indexToResultIdMap: Record<string, string>;
}

export class DpapiClient {
  private _config: EnvironmentConfig;
  constructor(env: NotifiEnvironment) {
    this._config = notifiConfigs(env);
  }

  async publishFusionMessage(
    jwt: string,
    messages: FusionMessage[],
  ): Promise<PublishFusionMessageResponse> {
    const url = this._config.dpapiUrl + '/FusionIngest/';
    const response = await fetch(url, {
      headers: new Headers([
        ['Accept', '*/*'],
        ['Accept-Language', 'en-US,en;q=0.9'],
        ['Authorization', `Bearer ${jwt}`],
        ['Cache-Control', 'no-cache'],
        ['Content-Type', 'application/json'],
        ['Pragma', 'no-cache'],
      ]),
      body: JSON.stringify({ data: messages }),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    // TODO: What does the error format look like?
    if (!response.ok) {
      throw new Error('Error in response :' + (await response.text()));
    }
    return await response.json();
  }
}
