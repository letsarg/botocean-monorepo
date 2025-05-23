import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CID, create, IPFSHTTPClient } from 'ipfs-http-client';

@Injectable()
export class BundleRegistryService implements OnModuleInit {
  private logger = new Logger(BundleRegistryService.name);
  private ipfs: IPFSHTTPClient;
  private bundleBasePath;
  constructor() {
    // this.bundleRegistryConfig = appConfig.bundleRegistryConfig;
    // this.bundleBasePath = path.join(appConfig.bundleRegistryConfig.basePath, '');
    this.bundleBasePath = path.join(__dirname, 'bundleReg');
    this.ipfs = create();
  }

  async onModuleInit() {
  }

  async pull(cid: string) {
    try {
      const bundlePath = path.join(this.bundleBasePath, cid);
      console.log(bundlePath);
      await this.saveDir(CID.parse(cid), bundlePath)

      this.logger.log(`Pulled bundle CID: ${cid}`);
    } catch (error) {
      this.logger.error(`Error pulling bundle CID: ${cid} err=${error}`);
    }
  }

  async saveDir(cid: CID, dirPath: string) {
    fs.mkdirSync(dirPath, { recursive: true });

    for await (const file of this.ipfs.ls(cid)) {
      const filePath = path.join(dirPath, file.name)
      if (file.type === 'file') {
        await this.saveFile(file.cid, filePath)
      } else {
        const childDirPath = path.join(dirPath, file.name)
        await this.saveDir(file.cid, childDirPath)
      }
    }
  }

  async saveFile(cid: CID, path: string) {
    for await (const file of this.ipfs.cat(cid)) {
      fs.appendFileSync(path, file);
    }
  }
}
