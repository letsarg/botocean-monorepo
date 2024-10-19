import { Module } from '@nestjs/common';
import { BundleControllerService } from './bundle-controller.service';
import { BundleRegistryService } from './bundle-registry.service';
import { BundleControllerController } from './bundle-controller.controller';

@Module({
  providers: [BundleControllerService, BundleRegistryService],
  controllers: [BundleControllerController]
})
export class BundleControllerModule {}
