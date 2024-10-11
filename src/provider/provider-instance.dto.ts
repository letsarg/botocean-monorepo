import { QUICConnection, QUICStream } from "@matrixai/quic";
import { HubMessage, HubMessageType, Message, OllamaChatRes, ProviderInfo } from "src/hub/hub.dto";
import { ModelType } from "src/prompt/prompt.dto";

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
    await this.writeTo(stream, req);
    let res = await this.readFrom(stream);
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
    await this.writeTo(stream, hubMsg);
    let res = await this.readFrom(stream);

    await stream.destroy()
    return res;
  }

  private async writeTo(stream: QUICStream, msg: HubMessage) {
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();
    const encReq = encoder.encode(JSON.stringify(msg));
    let writtenLen = 0;
    let totalWriteLen = encReq.length;
    // write the size of msg
    await writer.write(new Uint8Array([totalWriteLen]))
    while (writtenLen < totalWriteLen) {
      let bz = encReq.subarray(writtenLen, writtenLen + 1000)
      await writer.write(encReq)
      writtenLen += 1000;
    }
  }

  private async readFrom(stream: QUICStream): Promise<HubMessage> {
    let collectedEncRes: Uint8Array[] = [];
    let readLen = 0;
    let totalReadLen: number = undefined;
    for await (const encRes of stream.readable) {
      console.log(`read ${encRes}`)
      if (!totalReadLen) {
        totalReadLen = encRes[0];
      } else {
        collectedEncRes.push(encRes)
        readLen += encRes.length
        if (readLen == totalReadLen) {
          break;
        }
      }
    }

    let encRes = combineUint8Arrays(collectedEncRes);
    const decoder = new TextDecoder('utf-8');
    let jsonRes = decoder.decode(encRes)
    console.log(jsonRes);
    let res: HubMessage = JSON.parse(jsonRes);
    return res
  }
}

function combineUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  // Calculate the total length
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);

  // Create a new Uint8Array with the total length
  const combinedArray = new Uint8Array(totalLength);

  // Keep track of the current index
  let offset = 0;

  // Copy each array into the combined array
  arrays.forEach(arr => {
    combinedArray.set(arr, offset);
    offset += arr.length;
  });

  return combinedArray;
}