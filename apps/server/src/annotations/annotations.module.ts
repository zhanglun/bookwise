import { Module } from '@nestjs/common';
import { AnnotationsService } from './annotations.service';
import { AnnotationsController } from './annotations.controller';

@Module({
  controllers: [AnnotationsController],
  providers: [AnnotationsService]
})
export class AnnotationsModule {}
