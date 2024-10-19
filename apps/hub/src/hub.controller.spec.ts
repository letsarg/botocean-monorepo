import { Test, TestingModule } from '@nestjs/testing';
import { HubController } from './hub.controller';
import { HubService } from './hub.service';

describe('HubController', () => {
  let hubController: HubController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HubController],
      providers: [HubService],
    }).compile();

    hubController = app.get<HubController>(HubController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(hubController.getHello()).toBe('Hello World!');
    });
  });
});
