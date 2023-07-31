import * as path from 'node:path';
import * as fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
import * as MimeType from 'mime-types';
import { SettingsService } from '../settings/settings.service';

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
  constructor(private settingsService: SettingsService) {}

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

  public saveBookToLibrary(files: Array<Express.Multer.File>) {
    const libPath = this.settingsService.getLibraryPath();
    const infos = [];

    files.forEach((file) => {
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
      const name = book.metadata.title['#text']
        ? book.metadata.title['#text']
        : book.metadata.title;
      console.log(
        '🚀 ~ file: books.service.ts:152 ~ BooksService ~ files.forEach ~ book.metadata.title:',
        book.metadata.title,
      );
      const inventoryPath = path.join(libPath, name);

      if (!fs.existsSync(inventoryPath)) {
        fs.mkdirSync(inventoryPath);
      }

      fs.writeFileSync(
        path.join(inventoryPath, `${name}.${MimeType.extension(mimetype)}`),
        file.buffer,
      );
      cover && fs.writeFileSync(path.join(inventoryPath, 'cover.jpg'), cover);
    });

    return {
      infos,
    };
  }
}
