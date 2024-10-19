import { Module } from '@nestjs/common';
import { AxenodeController } from './axenode.controller';
import { AxenodeService } from './axenode.service';
import { AxeControllerModule } from './axe-controller/axe-controller.module';

@Module({
  imports: [AxeControllerModule],
  controllers: [AxenodeController],
  providers: [AxenodeService],
})
export class AxenodeModule { }
