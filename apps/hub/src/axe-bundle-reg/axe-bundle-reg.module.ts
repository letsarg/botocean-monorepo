import { Module } from '@nestjs/common';
import { AxeBundleRegService } from './axe-bundle-reg.service';

@Module({
  providers: [AxeBundleRegService]
})
export class AxeBundleRegModule {}
