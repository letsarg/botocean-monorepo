import { Controller, Get } from '@nestjs/common';
import { SeanodeService } from './seanode.service';

@Controller()
export class SeanodeController {
  constructor(private readonly seanodeService: SeanodeService) { }

  @Get()
  getHello(): string {
    return this.seanodeService.getHello();
  }
}
