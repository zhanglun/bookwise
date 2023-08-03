import * as path from 'node:path';
import * as fs from 'node:fs';
import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
import * as MimeType from 'mime-types';
import { SettingsService } from '../settings/settings.service';
import { Books } from './book.entity';
import { AuthorsService } from 'src/authors/authors.service';
import { PublishersService } from 'src/publishers/publishers.service';

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
    @InjectRepository(Books)
    private bookRepository: Repository<Books>,
    private settingsService: SettingsService,
    private authorsService: AuthorsService,
    private publishersService: PublishersService,
  ) {}

  public parseCover(book: Epub, bf: Buffer) {
    let coverHref = '';
    const { metadata, manifest } = book;

    [].concat(metadata.meta).forEach((item) => {
      if (item['@_name'] === 'cover') {
        const coverId = item['@_content'];

        manifest.item.forEach((item) => {
          if (item['@_id'] === coverId) {
            coverHref = item['@_href'];
          }
        });
      }
    });

    const zip = new AdmZip(bf);
    const zipEntries = zip.getEntries();
    const a = zipEntries.reduce((acu, z) => {
      console.log(z.entryName);
      if (z.entryName.lastIndexOf(coverHref) != -1) {
        acu = z.getData();
      }

      return acu;
    }, null as Buffer);

    return a;
  }

  public parseBook(content: Buffer): Epub {
    const zip = new AdmZip(content);
    const zipEntries = zip.getEntries();
    let res = {} as Epub;

    zipEntries.forEach((z) => {
      // console.log(z.entryName);

      const entryData = z.getData();

      switch (z.entryName.split(path.sep).pop()) {
        case 'container.xml':
          // console.log(entryData.toString());
          break;
        case 'mimetype':
          this.parseMimetype(entryData);
          break;
        case 'content.opf':
          console.log(entryData.toString());
          res = this.parseOPF(entryData);
          break;
        case 'toc.ncx':
          this.parseToc(entryData);
          break;
        default:
          break;
      }
    });

    return res;
  }

  public parseMimetype(bf: Buffer) {
    return bf.toString();
  }

  public parseToc(bf: Buffer) {
    const data = bf.toString();

    return data;
  }

  public parseOPF(bf: Buffer): Epub {
    const data = bf.toString();
    const parser = new XMLParser({
      ignoreAttributes: false,
      transformTagName: (tagName) => tagName.replace(/dc:/gi, ''),
    });

    const info = parser.parse(data);

    return { ...info.package };
  }

  public parseBookDate(book: Epub) {
    const { date } = book.metadata;

    if (!date) {
      return null;
    }

    return [].concat(date).reduce(
      (acu, item) => {
        if (typeof item === 'object') {
          if (item['@_opf:event'] === 'publication') {
            acu.publish_at = item['#text'];
          }
        }

        return acu;
      },
      { publish_at: '' },
    );
  }

  public parseBookPublisher(book: Epub) {
    const { metadata } = book;

    if (!metadata.publisher) {
      return null;
    }

    return metadata.publisher['#text']
      ? metadata.publisher['#text']
      : metadata.publisher;
  }

  public createBookModel(book: Epub) {
    const { metadata } = book;
    const title = metadata.title['#text']
      ? metadata.title['#text']
      : metadata.title;

    const publisher = this.parseBookPublisher(book);

    const author = metadata.creator['#text']
      ? metadata.creator['#text']
      : metadata.creator;

    const date = this.parseBookDate(book);

    const result = {
      title,
      publisher,
      author,
      ...date,
    };

    console.log(
      '🚀 ~ file: books.service.ts:177 ~ BooksService ~ createBookModel ~ result:',
      result,
    );

    return result;
  }

  public async saveBookToLibrary(
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    const libPath = this.settingsService.getLibraryPath();
    const infos = [];

    files.forEach(async (file) => {
      const { originalname, mimetype, buffer, size } = file;
      console.log(
        '🚀 ~ file: books.service.ts:133 ~ BooksService ~ files.forEach ~ mimetype:',
        mimetype,
      );

      infos.push({
        originalname,
        mimetype,
        size,
      });

      const book = this.parseBook(buffer);
      console.log(
        '🚀 ~ file: books.service.ts:141 ~ BooksService ~ files.forEach ~ book:',
        book,
      );
      const cover = this.parseCover(book, buffer);
      const title = book.metadata.title['#text']
        ? book.metadata.title['#text']
        : book.metadata.title;
      console.log(
        '🚀 ~ file: books.service.ts:152 ~ BooksService ~ files.forEach ~ book.metadata.title:',
        book.metadata.title,
      );
      const inventoryPath = path.join(libPath, title);
      const bookPath = path.join(
        inventoryPath,
        `${title}.${MimeType.extension(mimetype)}`,
      );

      if (!fs.existsSync(inventoryPath)) {
        fs.mkdirSync(inventoryPath);
      }

      fs.writeFileSync(bookPath, file.buffer);
      cover && fs.writeFileSync(path.join(inventoryPath, 'cover.jpg'), cover);

      const bookModel = this.createBookModel(book);
      const { id: author_id } = await this.authorsService.findOneOrCreate({
        name: bookModel.author,
      });
      const { id: publisher_id } = await this.publishersService.findOneOrCreate(
        {
          name: bookModel.publisher,
        },
      );

      await this.bookRepository.save({
        ...bookModel,
        author_id,
        publisher_id,
        path: bookPath,
      });
    });

    return {
      infos,
    };
  }

  public async findAll() {
    return this.bookRepository.find();
  }

  public async findOneWithId(id: string) {
    return this.bookRepository.findOneBy({ id });
  }

  /**
   * get cover.jpg
   * @param dir book dir
   * @returns StreamableFile
   */
  public getCoverFigure(dir: string): StreamableFile {
    const name = dir.split(path.sep);

    name.pop();
    name.push('cover.jpg');

    const coverPath = name.join(path.sep).trim();
    const file = fs.createReadStream(coverPath);

    return new StreamableFile(file);
  }
}
