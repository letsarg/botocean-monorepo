import { events, QUICServer, QUICSocket, ServerCryptoOps } from '@matrixai/quic';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Logger, { LogLevel, StreamHandler, formatting } from '@matrixai/logger';
import * as testsUtils from './utils';
import * as fs from "fs"
import { AppConfigService } from 'src/app-config/app-config.service';
import { HubMessage, HubMessageType } from './hub.dto';
import { ProviderInstance } from 'src/provider/provider-instance.dto';
import { ProviderService } from 'src/provider/provider.service';

@Injectable()
export class HubService implements OnModuleInit {
  private quicSocket: QUICSocket;
  private quicServer: QUICServer;
  private quicLogger;

  constructor(
    private appConfig: AppConfigService,
    private providerService: ProviderService,
  ) {
  }

  async onModuleInit() {
    const privateKey = fs.readFileSync(this.appConfig.hub.privkey_path, 'utf8');
    const publicKey = fs.readFileSync(this.appConfig.hub.pubkey_path, 'utf8');
    const certRSAPEM = fs.readFileSync(this.appConfig.hub.cert_path, 'utf8');
    const keyPairRSAPEM = {
      publicKey,
      privateKey
    };

    let key: ArrayBuffer = await testsUtils.generateKeyHMAC();
    let serverCryptoOps: ServerCryptoOps = {
      sign: testsUtils.signHMAC,
      verify: testsUtils.verifyHMAC,
    };
    const logger = new Logger(`${QUICServer.name} Test`, LogLevel.INFO, [
      new StreamHandler(
        formatting.format`${formatting.level}:${formatting.keys}:${formatting.msg}`,
      ),
    ]);
    this.quicSocket = new QUICSocket({
      logger: logger.getChild('socket'),
    });
    await this.quicSocket.start({
      host: this.appConfig.hub.host,
      port: this.appConfig.hub.port,
    });
    this.quicServer = new QUICServer({
      logger: logger.getChild(QUICServer.name),
      crypto: {
        key,
        ops: serverCryptoOps,
      },
      config: {
        key: keyPairRSAPEM.privateKey,
        cert: certRSAPEM,
      },
      socket: this.quicSocket,
    });
    this.quicServer.addEventListener(
      events.EventQUICServerConnection.name,
      async (e: events.EventQUICServerConnection) => {
        await this.handleConnection(e);
      }
    );
    await this.quicServer.start({
      host: this.appConfig.hub.host,
      port: this.appConfig.hub.port,
    })
  }

  private async handleConnection(e: events.EventQUICServerConnection) {
    const conn = e.detail

    // stream to get provider info
    const stream = conn.newStream();
    const writer = stream.writable.getWriter();
    const req: HubMessage = {
      type: HubMessageType.ProviderInfoReq,
    }
    const encoder = new TextEncoder();
    const encReq = encoder.encode(JSON.stringify(req));
    await writer.write(encReq)
    let res: HubMessage;
    const decoder = new TextDecoder('utf-8');
    for await (const encRes of stream.readable) {
      res = JSON.parse(decoder.decode(encRes));
      break;
    }

    let providerInst = new ProviderInstance();
    // TODO: use the actual provider id
    providerInst.id = res.providerInfoRes.providerId;
    providerInst.providerInfo = res.providerInfoRes
    providerInst.quicConn = conn;
    this.providerService.registerProvider(providerInst);

    conn.addEventListener(events.EventQUICConnectionClose.name, () => {
      this.providerService.deregisterProvider(providerInst.id)
    })
    conn.addEventListener(events.EventQUICConnectionError.name, () => {
      this.providerService.deregisterProvider(providerInst.id)
    })
  }
}
