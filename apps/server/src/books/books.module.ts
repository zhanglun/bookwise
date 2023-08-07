import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { SettingsService } from '../settings/settings.service';
import { Book } from './book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsService } from '../authors/authors.service';
import { AuthorsModule } from '../authors/authors.module';
import { Author } from '../authors/entities/author.entity';
import { PublishersModule } from '../publishers/publishers.module';
import { PublishersService } from '../publishers/publishers.service';
import { Publisher } from '../publishers/entities/publisher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Author, Publisher]),
    AuthorsModule,
    PublishersModule,
  ],
  controllers: [BooksController],
  providers: [BooksService, SettingsService, AuthorsService, PublishersService],
})
export class BooksModule {}
