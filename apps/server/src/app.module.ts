import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './modules/books/books.module';
import { SettingsModule } from './modules/settings/settings.module';
import configuration from './config/configuration';

import { AuthorsModule } from './modules/authors/authors.module';
import { PublishersModule } from './modules/publishers/publishers.module';
import { NotesModule } from './modules/notes/notes.module';
import { LangsModule } from './modules/langs/langs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BooksModule,
    SettingsModule,
    AuthorsModule,
    PublishersModule,
    NotesModule,
    LangsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
