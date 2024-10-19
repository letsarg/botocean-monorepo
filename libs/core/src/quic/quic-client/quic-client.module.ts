import { Module } from '@nestjs/common';
import { QuicClientService } from './quic-client.service';

@Module({
  providers: [QuicClientService]
})
export class QuicClientModule {}
