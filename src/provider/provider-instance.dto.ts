import { QUICConnection } from "@matrixai/quic";
import { ProviderInfo } from "src/hub/hub.dto";
import { ModelType } from "src/prompt/prompt.dto";

export class ProviderInstance {
  id: string;
  providerInfo: ProviderInfo;
  quicConn: QUICConnection;

  constructor() {
  }
}