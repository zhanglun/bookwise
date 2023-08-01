import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { SettingsService } from '../settings/settings.service';
import { Books } from './book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsService } from '../authors/authors.service';
import { AuthorsModule } from '../authors/authors.module';
import { Authors } from '../authors/entities/author.entity';
import { PublishersModule } from '../publishers/publishers.module';
import { PublishersService } from '../publishers/publishers.service';
import { Publishers } from '../publishers/entities/publisher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Books, Authors, Publishers]),
    AuthorsModule,
    PublishersModule,
  ],
  controllers: [BooksController],
  providers: [BooksService, SettingsService, AuthorsService, PublishersService],
})
export class BooksModule {}
