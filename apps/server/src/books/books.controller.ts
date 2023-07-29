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
    const { originalname, mimetype, buffer, size } = files[0];

    const epubbook = this.booksService.parseBook(buffer);

    console.log("🚀 ~ file: books.controller.ts:35 ~ BooksController ~ epubbook:", epubbook)

    return {
      body,
      file: {
        originalname,
        mimetype,
        size,
      },
      res: epubbook,
    };
  }
}
