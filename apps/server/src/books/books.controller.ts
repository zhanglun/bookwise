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
import { Books } from './book.entity';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('cover')
  @Header('Content-Type', 'image/jpg')
  getBookCover(@Query() query: { path: string }): StreamableFile {
    console.log("🚀 ~ file: books.controller.ts:27 ~ BooksController ~ getBookCover ~ query.path:", query.path)
    return this.booksService.getCoverFigure(query.path);
  }

  @Get()
  findAll(): Promise<Books[]> {
    return this.booksService.findAll();
  }

  @Get('/:id')
  findBookDetailWithId(@Param() param: { id: string }): Promise<Books> {
    return this.booksService.findOneWithId(param.id);
  }

  @Post()
  addOne(): any {
    return [];
  }

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(
      '🚀 ~ file: books.controller.ts:42 ~ BooksController ~ files:',
      files,
    );
    try {
      const res = await this.booksService.saveBookToLibrary(files);
      return res;
    } catch (err) {
      return err;
    }
  }
}
