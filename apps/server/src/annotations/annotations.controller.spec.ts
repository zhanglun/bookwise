import { Test, TestingModule } from '@nestjs/testing';
import { AnnotationsController } from './annotations.controller';
import { AnnotationsService } from './annotations.service';

describe('AnnotationsController', () => {
  let controller: AnnotationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnotationsController],
      providers: [AnnotationsService],
    }).compile();

    controller = module.get<AnnotationsController>(AnnotationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
