import { QUICConnection } from "@matrixai/quic";
import { HubMessage, HubMessageType, Message, OllamaChatRes, ProviderInfo } from "src/hub/hub.dto";
import { ModelType } from "src/prompt/prompt.dto";

export class ProviderInstance {
  id: string;
  providerInfo: ProviderInfo;
  quicConn: QUICConnection;

  constructor() {
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
    const encoder = new TextEncoder();
    const encReq = encoder.encode(JSON.stringify(hubMsg));
    const writer = stream.writable.getWriter();
    await writer.write(encReq)

    const decoder = new TextDecoder('utf-8');
    for await (const encRes of stream.readable) {
      let res: HubMessage;
      res = JSON.parse(decoder.decode(encRes));
      await stream.destroy()
      return res;
    }
  }
}