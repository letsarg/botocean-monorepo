import { ClientCryptoOps, events, QUICClient, QUICServer, QUICSocket, ServerCryptoOps } from '@matrixai/quic';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Logger, { LogLevel, StreamHandler, formatting } from '@matrixai/logger';
import * as testsUtils from './utils';
import * as fs from "fs"
import { ApplicationConfig } from '@nestjs/core';
import { AppConfigService } from 'src/app-config/app-config.service';
import { promise } from './utils';

@Injectable()
export class HubService implements OnModuleInit {
  private quicSocket: QUICSocket;
  private quicServer: QUICServer;
  private quicLogger;

  constructor(private appConfig: AppConfigService) {
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
        const conn = e.detail
        conn.addEventListener(
          events.EventQUICConnectionStream.name,
          async (streamEvent: events.EventQUICConnectionStream) => {
            const stream = streamEvent.detail;
            const decoder = new TextDecoder('utf-8');
            for await (const msg of stream.readable) {
              const str = decoder.decode(msg);
              console.log(`msg from client: ${str}`)
            }
          },
        );
      }
    );
    await this.quicServer.start({
      host: this.appConfig.hub.host,
      port: this.appConfig.hub.port,
    })

    setTimeout(async () => {
      console.log('connecting to quic server');
      const clientCryptoOps: ClientCryptoOps = {
        randomBytes: testsUtils.randomBytes,
      };
      const logger = new Logger(`${QUICClient.name} Test`, LogLevel.INFO, [
        new StreamHandler(
          formatting.format`${formatting.level}: ${formatting.keys}: ${formatting.msg}`,
        ),
      ]);
      const client = await QUICClient.createQUICClient({
        host: this.appConfig.hub.host,
        port: this.appConfig.hub.port,
        localHost: '::',
        crypto: {
          ops: clientCryptoOps,
        },
        logger: logger.getChild(QUICClient.name),
        config: {
          verifyPeer: false,
        },
      });
      console.log('created quic client');

      const stream = client.connection.newStream();
      const writer = stream.writable.getWriter();
      const str = "Hello from client";
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(str);
      await writer.write(uint8Array);
    }, 4000);
  }
}
