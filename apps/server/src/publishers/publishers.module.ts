import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PublishersController],
  providers: [PublishersService, PrismaService],
})
export class PublishersModule {}
