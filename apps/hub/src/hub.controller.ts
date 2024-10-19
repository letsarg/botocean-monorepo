import { Controller, Get } from '@nestjs/common';
import { HubService } from './hub.service';

@Controller()
export class HubController {
  constructor(private readonly hubService: HubService) {}

  @Get()
  getHello(): string {
    return this.hubService.getHello();
  }
}
