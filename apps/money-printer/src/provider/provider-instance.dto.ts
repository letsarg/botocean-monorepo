import { QUICConnection, QUICStream } from "@matrixai/quic";
import { HubMessage, HubMessageType, Message, ProviderInfo } from "src/hub/hub.dto";
import { numberToU8Array, readFrom, writeTo } from "./utils";

export class ProviderInstance {
  id: string;
  providerInfo: ProviderInfo;
  quicConn: QUICConnection;

  constructor() {
  }

  async getProviderInfo(quicConn: QUICConnection): Promise<this> {
    const stream = quicConn.newStream();
    let req: HubMessage = {
      type: HubMessageType.ProviderInfoReq,
    }
    await writeTo(stream, req);
    let res = await readFrom(stream);
    await stream.destroy()
    this.id = res.providerInfoRes.providerId;
    this.providerInfo = res.providerInfoRes;
    this.quicConn = quicConn;
    return this;
  }

  async chat(model: string, messages: Message[]): Promise<HubMessage> {
    const stream = this.quicConn.newStream();

    const hubMsg: HubMessage = {
      type: HubMessageType.ChatReq,
      ollamaChatReq: {
        model,
        messages
      }
    }
    await writeTo(stream, hubMsg);
    let res = await readFrom(stream);

    await stream.destroy()
    return res;
  }

}
