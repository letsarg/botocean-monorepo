import { Module } from '@nestjs/common';
import { AxeControllerService } from './axe-controller.service';
import { AxeRegistryService } from './axe-registry.service';

@Module({
  providers: [AxeControllerService, AxeRegistryService]
})
export class AxeControllerModule {}
