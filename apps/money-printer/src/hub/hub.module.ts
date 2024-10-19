import { Module } from '@nestjs/common';
import { HubService } from './hub.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  providers: [AppConfigService, HubService],
  imports: [ProviderModule]
})
export class HubModule { }
