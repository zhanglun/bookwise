import { Module } from '@nestjs/common';
import { LangsService } from './langs.service';
import { LangsController } from './langs.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [LangsController],
  providers: [LangsService, PrismaService],
})
export class LangsModule {}
