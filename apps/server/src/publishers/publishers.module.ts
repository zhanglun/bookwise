import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';

@Module({
  controllers: [PublishersController],
  providers: [PublishersService],
})
export class PublishersModule {}
