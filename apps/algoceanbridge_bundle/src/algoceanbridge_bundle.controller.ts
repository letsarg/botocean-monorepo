import { Controller, Get } from '@nestjs/common';
import { AlgoceanbridgeBundleService } from './algoceanbridge_bundle.service';

@Controller()
export class AlgoceanbridgeBundleController {
  constructor(private readonly algoceanbridgeBundleService: AlgoceanbridgeBundleService) {}

  @Get()
  getHello(): string {
    return this.algoceanbridgeBundleService.getHello();
  }
}
