import { Module } from '@nestjs/common';
import { SeanodeController } from './seanode.controller';
import { SeanodeService } from './seanode.service';
import { BundleControllerModule } from './bundle-controller/bundle-controller.module';

@Module({
  imports: [BundleControllerModule],
  controllers: [SeanodeController],
  providers: [SeanodeService],
})
export class SeanodeModule { }
