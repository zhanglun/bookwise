import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import {SettingsService} from "../settings/settings.service";

@Module({
  controllers: [BooksController],
  providers: [BooksService, SettingsService],
})
export class BooksModule {}
