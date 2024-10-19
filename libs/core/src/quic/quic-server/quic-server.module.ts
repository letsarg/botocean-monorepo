import { Module } from '@nestjs/common';
import { QuicServerService } from './quic-server.service';

@Module({
  providers: [QuicServerService],
  imports: [QuicServerModule]
})
export class QuicServerModule { }
