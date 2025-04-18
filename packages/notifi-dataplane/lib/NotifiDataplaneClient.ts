import {
  ActivateSmartLinkActionInput,
  ActivateSmartLinkActionResponse,
  isActivateSmartLinkActionResponse,
} from './types';
import { FusionMessage } from './types/FusionMessage';
import { PublishFusionMessageResponse } from './types/PublishFusionMessageResponse';

export class NotifiDataplaneClient {
  private _dpapiUrl: string;
  constructor(dpapiUrl: string) {
    this._dpapiUrl = dpapiUrl;
  }

  async publishFusionMessage(
    jwt: string,
    messages: Readonly<FusionMessage[]>,
  ): Promise<PublishFusionMessageResponse> {
    const url = this._dpapiUrl + '/FusionIngest/';
    const body = JSON.stringify({ data: messages });
    const response = await fetch(url, {
      headers: new Headers([
        ['Accept', '*/*'],
        ['Accept-Language', 'en-US,en;q=0.9'],
        ['Authorization', `Bearer ${jwt}`],
        ['Cache-Control', 'no-cache'],
        ['Content-Type', 'application/json'],
        ['Pragma', 'no-cache'],
      ]),
      body: body,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`ERROR: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    return result;
  }

  async activateSmartLinkAction(
    args: ActivateSmartLinkActionInput,
  ): Promise<ActivateSmartLinkActionResponse> {
    const url = this._dpapiUrl + `/Link/${args.smartLinkId}/`;
    const body = JSON.stringify({
      actionId: args.actionId,
      authParams: args.authParams,
      inputs: args.inputs
    });
    const response = await fetch(url, {
      headers: new Headers([
        ['Accept', '*/*'],
        ['Accept-Language', 'en-US,en;q=0.9'],
        ['Cache-Control', 'no-cache'],
        ['Content-Type', 'application/json'],
        ['Pragma', 'no-cache'],
      ]),
      body: body,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`ERROR: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();

    if (!isActivateSmartLinkActionResponse(result))
    {
      throw new Error(`ERROR: Response did not return an expected payload`);
    }

    return result as ActivateSmartLinkActionResponse;
  }
}
