import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, PrismaService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
