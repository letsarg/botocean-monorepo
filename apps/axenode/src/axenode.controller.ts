import { Controller, Get } from '@nestjs/common';
import { AxenodeService } from './axenode.service';

@Controller()
export class AxenodeController {
  constructor(private readonly axenodeService: AxenodeService) {}

  @Get()
  getHello(): string {
    return this.axenodeService.getHello();
  }
}
