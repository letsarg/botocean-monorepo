import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CID } from 'multiformats/cid'
import fs from 'fs';
import path from 'path';
import { create } from 'kubo-rpc-client';

@Injectable()
export class BundleRegistryService implements OnModuleInit {
  private logger = new Logger(BundleRegistryService.name);
  private helia;
  constructor() {
  }

  async onModuleInit() {
    // this.helia = await createHelia()
  }

  async pull(cid: string) {
    try {
      // const ufs = unixfs(this.helia);
      const ipfs = create();

      // for await (const file of ufs.cat(CID.parse(cid))) {
      //   const outputPath = path.join(__dirname, cid);
      //   fs.appendFileSync(outputPath, file);
      // }

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
