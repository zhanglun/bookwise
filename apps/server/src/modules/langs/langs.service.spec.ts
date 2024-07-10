import { Test, TestingModule } from '@nestjs/testing';
import { LangsService } from './langs.service';

describe('LangsService', () => {
  let service: LangsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LangsService],
    }).compile();

    service = module.get<LangsService>(LangsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
