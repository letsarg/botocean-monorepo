import { Module } from '@nestjs/common';
import { AlgoceanbridgeBundleController } from './algoceanbridge_bundle.controller';
import { AlgoceanbridgeBundleService } from './algoceanbridge_bundle.service';

@Module({
  imports: [],
  controllers: [AlgoceanbridgeBundleController],
  providers: [AlgoceanbridgeBundleService],
})
export class AlgoceanbridgeBundleModule {}
