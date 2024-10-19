import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { QuicModule } from './quic/quic.module';

@Module({
  providers: [CoreService],
  exports: [CoreService],
  imports: [],
})
export class CoreModule { }
