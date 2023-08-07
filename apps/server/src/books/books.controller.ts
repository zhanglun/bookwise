import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Query,
  StreamableFile,
  Header,
  Param,
  HttpCode,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { Book } from './book.entity';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('cover')
  @Header('Content-Type', 'image/jpg')
  getBookCover(@Query() query: { path: string }): StreamableFile {
    return this.booksService.getCoverFigure(query.path);
  }

  @Get()
  findAll(): Promise<Book[]> {
    console.log('findall');
    return this.booksService.findAll();
  }

  @Get('/:id')
  findBookDetailWithId(@Param() param: { id: string }): Promise<Book> {
    return this.booksService.findOneWithId(param.id);
  }

  @Post()
  addOne(): any {
    return [];
  }

  @Post('upload')
  @HttpCode(200)
  @Header('Content-Type', 'application/json; charset=utf-8')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(
      '🚀 ~ file: books.controller.ts:42 ~ BooksController ~ files:',
      files,
    );
    try {
      const res = await this.booksService.saveBookToLibrary(files);
      console.log(
        '🚀 ~ file: books.controller.ts:54 ~ BooksController ~ uploadFile ~ res:',
        res,
      );
      return res;
    } catch (err) {
      return err;
    }
  }
}
