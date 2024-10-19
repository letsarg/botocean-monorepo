import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { create } from 'ipfs-http-client';
import fs from 'fs';
import path from 'path';

@Injectable()
export class BundleRegistryService implements OnModuleInit {
  private logger = new Logger(BundleRegistryService.name);
  constructor() {
  }

  async onModuleInit() {
  }

  async pull(cid: string) {
    try {
      // Connect to your self-hosted IPFS node
      const ipfs = create({
        host: 'localhost',  // Your IPFS node host
        port: 5001,         // Your IPFS API port
        protocol: 'http'    // Use 'https' if your IPFS node uses SSL
      });

      for await (const file of ipfs.cat(cid)) {
        const outputPath = path.join(__dirname, cid);
        fs.appendFileSync(outputPath, file);
      }

      this.logger.log(`Pulled bundle CID: ${cid}`);
    } catch (error) {
      this.logger.error(`Error pulling bundle CID: ${cid} err=${error}`);
    }
  }
}
