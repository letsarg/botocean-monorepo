import { Test, TestingModule } from '@nestjs/testing';
import { AccountingBundleController } from './accounting_bundle.controller';
import { AccountingBundleService } from './accounting_bundle.service';

describe('AccountingBundleController', () => {
  let accountingBundleController: AccountingBundleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountingBundleController],
      providers: [AccountingBundleService],
    }).compile();

    accountingBundleController = app.get<AccountingBundleController>(AccountingBundleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(accountingBundleController.getHello()).toBe('Hello World!');
    });
  });
});
