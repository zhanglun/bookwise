import { Test, TestingModule } from '@nestjs/testing';
import { LangsController } from './langs.controller';
import { LangsService } from './langs.service';

describe('LangsController', () => {
  let controller: LangsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LangsController],
      providers: [LangsService],
    }).compile();

    controller = module.get<LangsController>(LangsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
