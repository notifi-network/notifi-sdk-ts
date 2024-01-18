import { FusionMessage } from "./types/FusionMessage";
import { PublishFusionMessageResponse } from "./types/PublishFusionMessageResponse";

export class NotifiDataplaneClient {
  private _dpapiUrl: string;
  constructor(dpapiUrl: string) {
    this._dpapiUrl = dpapiUrl;
  }

  async publishFusionMessage(jwt: string, messages: Readonly<FusionMessage[]>): Promise<PublishFusionMessageResponse> {
    const url = this._dpapiUrl + "/FusionIngest/";
    const body = JSON.stringify({ data: messages });
    const response = await fetch(url, {
      "headers": new Headers([
        ["Accept", "*/*"],
        ["Accept-Language", "en-US,en;q=0.9"],
        ["Authorization", `Bearer ${jwt}`],
        ["Cache-Control", "no-cache"],
        ["Content-Type", "application/json"],
        ["Pragma", "no-cache"],
      ]),
      "body": body,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    // TODO: What does the error format look like?
    if (!response.ok) {
      throw new Error("Error in response :" + await response.text());
    }
    const result = await response.json();
    return result;
  }
}