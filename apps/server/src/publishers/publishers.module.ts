import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publishers } from './entities/publisher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publishers])],
  controllers: [PublishersController],
  providers: [PublishersService],
})
export class PublishersModule {}
