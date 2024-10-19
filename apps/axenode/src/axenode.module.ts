import { Module } from '@nestjs/common';
import { AxenodeController } from './axenode.controller';
import { AxenodeService } from './axenode.service';

@Module({
  imports: [],
  controllers: [AxenodeController],
  providers: [AxenodeService],
})
export class AxenodeModule {}
