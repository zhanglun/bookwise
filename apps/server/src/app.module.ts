import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { SettingsModule } from './settings/settings.module';
import configuration from './config/configuration';

import { Books } from './books/book.entity';
import { AuthorsModule } from './authors/authors.module';
import { Authors } from './authors/entities/author.entity';
import { PublishersModule } from './publishers/publishers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'bookwise.db',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Books, Authors],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BooksModule,
    SettingsModule,
    AuthorsModule,
    PublishersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
