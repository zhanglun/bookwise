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
  Logger,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { UpdateAdditionalInfoDto } from './dto/update-additional-info';
import { PaginatedResource } from './dto/find-book.dto';
import {
  Filtering,
  FilteringParams,
  Sorting,
  SortingParams,
} from './books.decorator';
import { Book } from '@prisma/client';

export interface AddBooKBody {
  book: Book;
  // blob: Blob;
}

@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);
  constructor(private booksService: BooksService) {}

  // @Get('cover')
  // @Header('Content-Type', 'image/jpg')
  // getBookCover(@Query() query: { path: string }): StreamableFile {
  //   return this.booksService.getCoverFigure(query.path);
  // }

  @Get('/recently-reading')
  queryRecentlyReading(): Promise<Book[]> {
    return this.booksService.queryRecentlyReading();
  }

  @Get()
  findAll(
    @SortingParams([
      'title',
      'author.name',
      'publisher.name',
      'additional_info.read_progress_updated_at',
      'additional_info.read_progress',
      'created_at',
      'updated_at',
      'publish_at',
    ])
    sort?: Sorting,
    @FilteringParams([
      'title',
      'author_id',
      'publisher_id',
      'format',
      'language_id',
    ])
    filter?: Filtering,
  ): Promise<PaginatedResource<Partial<Book>>> {
    this.logger.log(
      `REST request to get books:, ${JSON.stringify(sort)}, ${JSON.stringify(
        filter,
      )}`,
    );
    return this.booksService.findAll(sort, filter);
  }

  @Get('/:id')
  findBookDetailWithId(@Param() param: { id: number }): Promise<Book> {
    return this.booksService.findOneWithId(param.id);
  }

  // @Get('/:id/blobs')
  // async getBookFileBlobsWithId(
  //   @Param() param: { id: string },
  // ): Promise<StreamableFile> {
  //   const file = await this.booksService.getBookFileBlobs(param.id);

  //   return new StreamableFile(file);
  // }

  // @Get('/:id/additional_infos')
  // async getBookAdditionalInfo(@Param() param: { id: number }) {
  //   return this.booksService.getAdditionalInfo(param.id);
  // }

  @Post('/:id/additional_infos')
  async updateBookAdditionalInfo(
    @Param() param: { id: number },
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
    return this.booksService.deleteBook(+query.id);
  }

  @Post()
  addOne(@Body() body: AddBooKBody): any {
    console.log('%c Line:121 🥐 body', 'color:#e41a6a', body);
    //TODO: create book record
    return [];
  }

  @Post('upload/files')
  @HttpCode(200)
  @Header('Content-Type', 'application/json; charset=utf-8')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    const book = JSON.parse(body.book);
    const cover = body.cover;
    const file = files[0];
    const res = await this.booksService.saveBookToLibrary(file, book, cover);
    console.log(
      '🚀 ~ file: books.controller.ts:54 ~ BooksController ~ uploadFile ~ res:',
      res,
    );
    return res;
  }
}
