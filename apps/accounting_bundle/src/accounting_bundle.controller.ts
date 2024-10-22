import { Controller, Get } from '@nestjs/common';
import { AccountingBundleService } from './accounting_bundle.service';

@Controller()
export class AccountingBundleController {
  constructor(private readonly accountingBundleService: AccountingBundleService) {}

  @Get()
  getHello(): string {
    return this.accountingBundleService.getHello();
  }
}
