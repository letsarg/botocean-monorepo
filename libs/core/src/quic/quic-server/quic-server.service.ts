import { events, QUICServer, QUICSocket, ServerCryptoOps } from '@matrixai/quic';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Logger, { LogLevel, StreamHandler, formatting } from '@matrixai/logger';
import * as testsUtils from '../utils';
import * as fs from "fs"
import { QuicServerConfig } from '../types';

@Injectable()
export class QuicServerService implements OnModuleInit {
  private logger = new Logger(QuicServerService.name);
  private quicConfig: QuicServerConfig;
  private quicSocket: QUICSocket;
  private quicServer: QUICServer;

  constructor(quicConfig: QuicServerConfig) {
    this.quicConfig = quicConfig;
  }

  async onModuleInit() {
    const privateKey = fs.readFileSync(this.quicConfig.privkey_path, 'utf8');
    const publicKey = fs.readFileSync(this.quicConfig.pubkey_path, 'utf8');
    const certRSAPEM = fs.readFileSync(this.quicConfig.cert_path, 'utf8');
    const keyPairRSAPEM = {
      publicKey,
      privateKey
    };

    let key: ArrayBuffer = await testsUtils.generateKeyHMAC();
    let serverCryptoOps: ServerCryptoOps = {
      sign: testsUtils.signHMAC,
      verify: testsUtils.verifyHMAC,
    };
    const logger = new Logger(`${QUICServer.name}`, LogLevel.INFO, [
      new StreamHandler(
        formatting.format`${formatting.level}:${formatting.keys}:${formatting.msg}`,
      ),
    ]);
    this.quicSocket = new QUICSocket({
      logger: logger.getChild('socket'),
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
  }

  getQuicServer() {
    return this.quicServer;
  }

  async quicServe() {
    await this.quicSocket.start({
      host: this.quicConfig.host,
      port: this.quicConfig.port,
    });
    await this.quicServer.start({
      host: this.quicConfig.host,
      port: this.quicConfig.port,
    })
  }

  private async addEventListener() {
    this.quicServer.addEventListener(
      events.EventQUICServerConnection.name,
      async (e: events.EventQUICServerConnection) => {
        try {
          await this.handleConnection(e);
        } catch (error) {
          this.logger.error(`handle conn failed: ${error}`);
        }
      }
    );
  }

  private async handleConnection(e: events.EventQUICServerConnection) {
    const conn = e.detail
    const connId = conn.connectionId.toString();

    // handle closed conn
    conn.addEventListener(
      events.EventQUICConnectionClose.name,
      (e: events.EventQUICConnectionClose) => {

      }
    )
  }
}
