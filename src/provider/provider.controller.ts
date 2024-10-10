import { Controller, Get } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  /**
   *
   */
  constructor(private providerService: ProviderService) {
  }

  @Get()
  getProviders() {
    console.log(this.providerService.modelProviderMap)
    return "hello"
  }
}
