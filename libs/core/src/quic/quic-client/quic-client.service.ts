import { ClientCryptoOps, events, QUICClient, QUICStream } from '@matrixai/quic';
import { Injectable, Logger as NestLogger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import Logger, { LogLevel, StreamHandler, formatting } from '@matrixai/logger';
import * as testsUtils from '../utils';
import { QuicClientConfig } from '../types';
import { readFrom, writeTo } from '../utils';

@Injectable()
export class QuicClientService implements OnModuleInit, OnApplicationShutdown {
  private logger = new NestLogger(QuicClientService.name)
  private quicConfig: QuicClientConfig;
  private quicClient: QUICClient;

  constructor(quicConfig: QuicClientConfig) {
    this.quicConfig = quicConfig;
  }

  async onModuleInit() {
    await this.setupQuic();
  }

  async setupQuic() {
    this.logger.log('Connecting to quic server');
    const clientCryptoOps: ClientCryptoOps = {
      randomBytes: testsUtils.randomBytes,
    };
    const quicLogger = new Logger(`${QUICClient.name}`, LogLevel.INFO, [
      new StreamHandler(
        formatting.format`${formatting.level}: ${formatting.keys}: ${formatting.msg}`,
      ),
    ]);
    this.quicClient = await QUICClient.createQUICClient({
      host: this.quicConfig.host,
      port: this.quicConfig.port,
      crypto: {
        ops: clientCryptoOps,
      },
      logger: quicLogger.getChild(QUICClient.name),
      config: {
        verifyPeer: false,
      },
    });
    this.logger.log('Created quic client');
  }

  async onApplicationShutdown(signal?: string) {
    try {
      await this.quicClient.destroy({ isApp: true });
    } catch (error) {
      this.logger.error(error)
    }
  }

  getQuicClient() {
    return this.quicClient
  }

  private async addEventListener() {
    this.quicClient.addEventListener(
      events.EventQUICConnectionStream.name,
      async (e: events.EventQUICConnectionStream) => {
        this.handleConnectionStream.bind(this);
        try {
          await this.handleConnectionStream(e);
        } catch (error) {
          this.logger.log('stream closed')
        }
      }
    );
  }

  private async handleConnectionStream(e: events.EventQUICConnectionStream) {
    const stream = e.detail;

    let msg = await readFrom(stream);
    await writeTo(stream, {})
  }
}
