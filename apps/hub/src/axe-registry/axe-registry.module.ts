import { Module } from '@nestjs/common';
import { AxeRegistryService } from './axe-registry.service';

@Module({
  providers: [AxeRegistryService]
})
export class AxeRegistryModule {}
