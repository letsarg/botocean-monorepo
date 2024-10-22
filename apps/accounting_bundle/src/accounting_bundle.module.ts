import { Module } from '@nestjs/common';
import { AccountingBundleController } from './accounting_bundle.controller';
import { AccountingBundleService } from './accounting_bundle.service';

@Module({
  imports: [],
  controllers: [AccountingBundleController],
  providers: [AccountingBundleService],
})
export class AccountingBundleModule {}
