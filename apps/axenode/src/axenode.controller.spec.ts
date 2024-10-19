import { Test, TestingModule } from '@nestjs/testing';
import { AxenodeController } from './axenode.controller';
import { AxenodeService } from './axenode.service';

describe('AxenodeController', () => {
  let axenodeController: AxenodeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AxenodeController],
      providers: [AxenodeService],
    }).compile();

    axenodeController = app.get<AxenodeController>(AxenodeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(axenodeController.getHello()).toBe('Hello World!');
    });
  });
});
