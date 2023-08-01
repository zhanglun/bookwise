import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { SettingsService } from '../settings/settings.service';
import { Books } from './book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsService } from 'src/authors/authors.service';
import { AuthorsModule } from 'src/authors/authors.module';
import { Authors } from 'src/authors/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Books, Authors]), AuthorsModule],
  controllers: [BooksController],
  providers: [BooksService, SettingsService, AuthorsService],
})
export class BooksModule {}
