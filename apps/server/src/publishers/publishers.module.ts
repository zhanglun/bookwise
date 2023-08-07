import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publisher } from './entities/publisher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publisher])],
  controllers: [PublishersController],
  providers: [PublishersService],
})
export class PublishersModule {}
