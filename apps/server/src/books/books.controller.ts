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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { Books } from './book.entity';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  findAll(): Promise<Books[]> {
    return this.booksService.findAll();
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
    try {
      return this.booksService.saveBookToLibrary(files);
    } catch (err) {
      return err;
    }
  }

  @Get('cover')
  @Header('Content-Type', 'image/jpg')
  getBookCover(@Query() query: { path: string }): StreamableFile {
    return this.booksService.getCoverFigure(query.path);
  }
}
