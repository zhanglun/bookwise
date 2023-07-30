import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  findAll(): [] {
    return [];
  }

  @Post()
  addOne(): any {
    return [];
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.booksService.saveBookToLibrary(files);
  }
}
