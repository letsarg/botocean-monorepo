import { Test, TestingModule } from '@nestjs/testing';
import { AlgoceanbridgeBundleController } from './algoceanbridge_bundle.controller';
import { AlgoceanbridgeBundleService } from './algoceanbridge_bundle.service';

describe('AlgoceanbridgeBundleController', () => {
  let algoceanbridgeBundleController: AlgoceanbridgeBundleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AlgoceanbridgeBundleController],
      providers: [AlgoceanbridgeBundleService],
    }).compile();

    algoceanbridgeBundleController = app.get<AlgoceanbridgeBundleController>(AlgoceanbridgeBundleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(algoceanbridgeBundleController.getHello()).toBe('Hello World!');
    });
  });
});
