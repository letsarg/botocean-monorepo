import { Module } from '@nestjs/common';
import { HubService } from './hub.service';
import { AppConfigService } from 'src/app-config/app-config.service';

@Module({
  providers: [HubService, AppConfigService]
})
export class HubModule {}
