import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFiles,
  Query,
  Body,
  StreamableFile,
  Header,
  Param,
  HttpCode,
  Delete,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { UpdateAdditionalInfoDto } from './dto/update-additional-info';

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
    return this.booksService.findAll();
  }

  @Get('/:id')
  findBookDetailWithId(@Param() param: { id: string }): Promise<Book> {
    return this.booksService.findOneWithId(param.id);
  }

  @Get('/:id/blobs')
  async getBookFileBlobsWithId(
    @Param() param: { id: string },
  ): Promise<StreamableFile> {
    const file = await this.booksService.getBookFileBlobs(param.id);

    return new StreamableFile(file);
  }

  @Get('/:id/additional_infos')
  async getBookAdditionalInfo(@Param() param: { id: string }) {
    return this.booksService.getAdditionalInfo(param.id);
  }

  @Post('/:id/additional_infos')
  async updateBookAdditionalInfo(
    @Param() param: { id: string },
    @Body() updateAdditionalInfoDto: UpdateAdditionalInfoDto,
  ) {
    return this.booksService.updateAdditionalInfo(
      param.id,
      updateAdditionalInfoDto,
    );
  }

  @Delete()
  deleteBookWithId(@Query() query: { id: string }): Promise<{
    removeExist: boolean;
    removedDir: string;
    removedRow: number;
  }> {
    return this.booksService.deleteBook(query.id);
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
