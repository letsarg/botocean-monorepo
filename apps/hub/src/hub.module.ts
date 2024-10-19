import { Module } from '@nestjs/common';
import { HubController } from './hub.controller';
import { HubService } from './hub.service';

@Module({
  imports: [],
  controllers: [HubController],
  providers: [HubService],
})
export class HubModule {}
