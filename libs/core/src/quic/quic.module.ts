import { Module } from '@nestjs/common';
import { QuicService } from './quic.service';

@Module({
  providers: [QuicService]
})
export class QuicModule {}
