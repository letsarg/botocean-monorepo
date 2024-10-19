import { Module } from '@nestjs/common';
import { AxenodeController } from './axenode.controller';
import { AxenodeService } from './axenode.service';
import { BundleControllerModule } from './bundle-controller/bundle-controller.module';

@Module({
  imports: [BundleControllerModule],
  controllers: [AxenodeController],
  providers: [AxenodeService],
})
export class AxenodeModule { }
