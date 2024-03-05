import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { SettingsService } from '../settings/settings.service';
import { AuthorsService } from '../authors/authors.service';
import { AuthorsModule } from '../authors/authors.module';
import { PublishersModule } from '../publishers/publishers.module';
import { PublishersService } from '../publishers/publishers.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [AuthorsModule, PublishersModule],
  controllers: [BooksController],
  providers: [
    BooksService,
    SettingsService,
    AuthorsService,
    PublishersService,
    PrismaService,
  ],
})
export class BooksModule {}
