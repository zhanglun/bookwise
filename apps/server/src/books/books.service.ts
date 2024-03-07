import * as path from 'node:path';
import * as fs from 'node:fs';
import { Injectable, StreamableFile } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
import * as MimeType from 'mime-types';
import { SettingsService } from '../settings/settings.service';
import { AuthorsService } from 'src/authors/authors.service';
import { PublishersService } from 'src/publishers/publishers.service';
import { UpdateAdditionalInfoDto } from './dto/update-additional-info';
import { PaginatedResource } from './dto/find-book.dto';
import { Filtering, getOrder, getWhere, Sorting } from './books.decorator';
import { PrismaService } from 'src/prisma.service';
import { Book, Prisma } from '@prisma/client';
import { AddBooKBody } from './books.controller';

interface EpubIdentifier {
  scheme: string;
  value: string;
}

interface ManiFestItem {
  id: string;
  href: string;
  mediaType: string;
}

interface EpubManifest {
  item: ManiFestItem[];
}

interface EpubMetadata {
  title: string;
  creator: string;
  publisher: string;
  contributor: string;
  identifier: EpubIdentifier[];
  date: string;
  language: string;
  cover: string;
  meta: { name: string; content: string }[];
}

export interface Epub {
  metadata: EpubMetadata;
  manifest: EpubManifest;
}

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
    private authorsService: AuthorsService,
    private publishersService: PublishersService,
  ) {}

  public async queryRecentlyReading() {
    return this.prisma.book.findMany({
      orderBy: {
        additional_infos: {
          read_progress_updated_at: 'desc',
        },
      },
      include: {
        authors: true,
        publisher: true,
        additional_infos: true,
      },
    });
  }
  public async findAll(
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<Partial<Book>>> {
    const finder = getWhere(filter);

    const order = getOrder(sort);
    console.log('%c Line:73 🌶 orer', 'color:#33a5ff', order);

    console.log('%c Line:76 🌽 a', 'color:#2eafb0', finder);

    const record = await this.prisma.book.findMany({
      // where: finder,
      // where: {
      //   authors: {
      //     none: {
      //       author: {
      //         name: 'ga',
      //       },
      //     },
      //   },
      // },
      orderBy: order,
      include: {
        authors: true,
        publisher: true,
      },
    });

    console.log(record);

    return {
      items: [],
      total: 0,
    };
  }

  public async findOneWithId(id: number) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  public async updateAdditionalInfo(
    book_id: number,
    updateAdditionalInfoDto: UpdateAdditionalInfoDto,
  ) {
    // const book = await this.prisma.book.findUnique({ where: { id: book_id } });
    // if (!book) {
    //   return;
    // }
    // const record = await this.prisma.bookAdditionalInfo.findUnique({
    //   relationLoadStrategy: 'query',
    //   include: {
    //     book: {
    //       bookId: book_id,
    //     },
    //   },
    // });
    // if (!record) {
    //   return this.prisma.bookAdditionalInfo.create({
    //     data: {
    //       ...updateAdditionalInfoDto,
    //       book,
    //     },
    //   });
    // } else {
    //   const res = await this.prisma.bookAdditionalInfo.update({
    //     where: { id: record.id },
    //     data: {
    //       ...updateAdditionalInfoDto,
    //     },
    //   });
    // }
    // return record;
  }
  public async deleteBook(id: number) {
    const bookEntity = await this.prisma.book.findUnique({ where: { id } });
    const result: {
      removeExist: boolean;
      removedDir: string;
      removedRow: number;
    } = {
      removeExist: false,
      removedDir: '',
      removedRow: 0,
    };

    if (bookEntity) {
      const deleteResult = await this.prisma.book.delete({ where: { id } });

      result.removedRow = 1;

      if (deleteResult && fs.existsSync(bookEntity.path)) {
        let folderDir = bookEntity.path;

        // folderDir.pop();

        // console.log(
        //   '🚀 ~ file: books.service.ts:288 ~ BooksService ~ deleteBook ~ folderDir:',
        //   folderDir,
        // );

        // folderDir = folderDir.join(path.sep) as string;

        if (fs.existsSync(folderDir)) {
          fs.rmSync(folderDir, { recursive: true, force: true });
          result.removeExist = true;
          result.removedDir = folderDir;
        }
      }
    }

    return result;
  }
  public parseCover(cover: string, bf: Buffer): [buf: Buffer, str: string] {
    console.log('%c Line:186 🥒 cover', 'color:#6ec1c2', cover);

    const zip = new AdmZip(bf);
    const zipEntries = zip.getEntries();
    const a = zipEntries.reduce((acu, z) => {
      console.log('z.entry', z.entryName);
      if (z.entryName.lastIndexOf(cover) != -1) {
        acu = z.getData();
      }

      return acu;
    }, null as Buffer);

    return [a, a.toString('base64')];
  }

  public async saveBookToLibrary(
    file: Express.Multer.File,
    book: any,
    coverPath: string,
  ): Promise<any> {
    const libPath = this.settingsService.getLibraryPath();
    const infos = [];

    const { mimetype, buffer } = file;

    if (mimetype !== 'application/epub+zip') {
      return;
    }

    console.log(
      '🚀 ~ file: books.service.ts:141 ~ BooksService ~ files.forEach ~ book:',
      book,
    );
    console.log('%c Line:206 🍷 coverPath', 'color:#ffdd4d', coverPath);
    const inventoryPath = path.join(libPath, book.title);
    const bookPath = path.join(
      inventoryPath,
      `${book.title}.${MimeType.extension(mimetype)}`,
    );

    const cover = this.parseCover(coverPath, buffer);

    console.log('%c Line:222 🍰 bookPath', 'color:#42b983', bookPath);
    console.log('%c Line:227 🧀 cover', 'color:#93c0a4', cover);

    if (!fs.existsSync(inventoryPath)) {
      fs.mkdirSync(inventoryPath);
    }

    fs.writeFileSync(bookPath, file.buffer);
    cover && fs.writeFileSync(path.join(inventoryPath, 'cover.jpg'), cover[0]);

    const bookModel = { ...book };

    bookModel.path = bookPath;
    bookModel.cover = cover[1];

    console.log(
      '🚀 ~ file: books.service.ts:242 ~ BooksService ~ bookModel:',
      bookModel,
    );

    const author = await this.prisma.author.upsert({
      where: {
        name: book.authors,
      },
      update: {
        name: book.authors,
      },
      create: {
        name: book.authors,
      },
    });
    const publisher = await this.prisma.publisher.upsert({
      where: {
        name: book.publisher,
      },
      update: {
        name: book.publisher,
      },
      create: {
        name: book.publisher,
      },
    });

    const language = await this.prisma.language.upsert({
      where: {
        code: book.language,
      },
      update: {
        code: book.language,
      },
      create: {
        code: book.language,
      },
    });

    console.log('%c Line:249 🍩 author', 'color:#b03734', author);
    console.log('%c Line:254 🍌 publisher', 'color:#ea7e5c', publisher);
    console.log('%c Line:273 🥚 language', 'color:#3f7cff', language);

    const bookPo = await this.prisma.book.create({
      data: {
        ...bookModel,
        authors: {
          connect: { id: author.id },
        },
        publisher: {
          connect: { id: publisher.id },
        },
        language: {
          connect: { id: language.id },
        },
      },
    });

    // const bookEntity = this.bookRepository.create({
    //   ...bookModel,
    //   author,
    //   publisher,
    //   path: bookPath,
    // });

    // const bookPO = await this.dataSource.manager.save(bookEntity);

    // infos.push(bookPO);

    return {
      // ...bookPo,
    };
  }
}
// @Injectable()
// export class BooksService {
//   constructor(
//     @InjectRepository(Book)
//     private bookRepository: Repository<Book>,
//     @InjectRepository(AdditionalInfoEntity)
//     private additionalInfoRepository: Repository<AdditionalInfoEntity>,
//     private settingsService: SettingsService,
//     private authorsService: AuthorsService,
//     private publishersService: PublishersService,
//     private dataSource: DataSource,
//   ) {}

//   public parseCover(book: Epub, bf: Buffer): [buf: Buffer, str: string] {
//     let coverHref = '';
//     const { metadata, manifest } = book;

//     [].concat(metadata.meta).forEach((item) => {
//       if (item['@_name'] === 'cover') {
//         const coverId = item['@_content'];

//         manifest.item.forEach((item) => {
//           if (item['@_id'] === coverId) {
//             coverHref = item['@_href'];
//           }
//         });
//       }
//     });

//     const zip = new AdmZip(bf);
//     const zipEntries = zip.getEntries();
//     const a = zipEntries.reduce((acu, z) => {
//       console.log('z.entry', z.entryName);
//       if (z.entryName.lastIndexOf(coverHref) != -1) {
//         acu = z.getData();
//       }

//       return acu;
//     }, null as Buffer);

//     return [a, a.toString('base64')];
//   }

//   public parseEpubBook(content: Buffer): Epub {
//     const zip = new AdmZip(content);
//     const zipEntries = zip.getEntries();
//     let res = {} as Epub;

//     zipEntries.forEach((z) => {
//       // console.log(z.entryName);

//       const entryData = z.getData();

//       switch (z.entryName.split(path.sep).pop()) {
//         case 'container.xml':
//           // console.log(entryData.toString());
//           break;
//         case 'mimetype':
//           this.parseMimetype(entryData);
//           break;
//         case 'content.opf':
//           console.log(entryData.toString());
//           res = this.parseOPF(entryData);
//           break;
//         case 'toc.ncx':
//           this.parseToc(entryData);
//           break;
//         default:
//           break;
//       }
//     });

//     return res;
//   }

//   public parseMimetype(bf: Buffer) {
//     return bf.toString();
//   }

//   public parseToc(bf: Buffer) {
//     const data = bf.toString();

//     return data;
//   }

//   public parseOPF(bf: Buffer): Epub {
//     const data = bf.toString();
//     const parser = new XMLParser({
//       ignoreAttributes: false,
//       transformTagName: (tagName) => tagName.replace(/dc:/gi, ''),
//     });

//     const info = parser.parse(data);

//     return { ...info.package };
//   }

//   public parseBookDate(book: Epub) {
//     const { date } = book.metadata;

//     if (!date) {
//       return null;
//     }

//     return [].concat(date).reduce(
//       (acu, item) => {
//         if (typeof item === 'object') {
//           if (item['@_opf:event'] === 'publication') {
//             acu.publish_at = item['#text'];
//           }
//         }

//         return acu;
//       },
//       { publish_at: '' },
//     );
//   }

//   public parseBookPublisher(book: Epub) {
//     const { metadata } = book;

//     if (!metadata.publisher) {
//       return '';
//     }

//     return metadata.publisher['#text']
//       ? metadata.publisher['#text']
//       : metadata.publisher;
//   }

//   public createBookModel(book: Epub) {
//     const { metadata } = book;
//     const title = metadata.title['#text']
//       ? metadata.title['#text']
//       : metadata.title;
//     const publisher = this.parseBookPublisher(book);
//     const author = metadata.creator['#text']
//       ? metadata.creator['#text']
//       : metadata.creator;
//     const date = this.parseBookDate(book);
//     const result = {
//       title,
//       publisher,
//       author,
//       ...date,
//     };

//     return result;
//   }

//   public async getBookFileBlobs(id: string): Promise<fs.ReadStream> {
//     const bookEntity = await this.bookRepository.findOneBy({ id });

//     console.log('%c Line:276 🍆 bookEntity', 'color:#f5ce50', bookEntity);

//     if (bookEntity) {
//       const { path } = bookEntity;

//       if (fs.existsSync(path)) {
//         return fs.createReadStream(path);
//       }
//     }
//   }

//   public async deleteBook(id: string) {
//     const bookEntity = await this.bookRepository.findOneBy({ id: id });
//     const result: {
//       removeExist: boolean;
//       removedDir: string;
//       removedRow: number;
//     } = {
//       removeExist: false,
//       removedDir: '',
//       removedRow: 0,
//     };

//     if (bookEntity) {
//       const deleteResult = await this.bookRepository.delete({ id });

//       result.removedRow = deleteResult.affected;

//       if (deleteResult.affected === 1 && fs.existsSync(bookEntity.path)) {
//         let folderDir: string | string[] = bookEntity.path.split(path.sep);

//         folderDir.pop();

//         console.log(
//           '🚀 ~ file: books.service.ts:288 ~ BooksService ~ deleteBook ~ folderDir:',
//           folderDir,
//         );

//         folderDir = folderDir.join(path.sep);

//         if (fs.existsSync(folderDir)) {
//           fs.rmSync(folderDir, { recursive: true, force: true });
//           result.removeExist = true;
//           result.removedDir = folderDir;
//         }
//       }
//     }

//     return result;
//   }

//   /**
//    * get cover.jpg
//    * @param dir book dir
//    * @returns StreamableFile
//    */
//   public getCoverFigure(dir: string): StreamableFile {
//     const name = dir.split(path.sep);

//     name.pop();
//     name.push('cover.jpg');

//     const coverPath = name.join(path.sep).trim();
//     const file = fs.createReadStream(coverPath);

//     return new StreamableFile(file);
//   }

// }
