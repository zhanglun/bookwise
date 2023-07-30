import * as path from 'node:path';
import * as fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
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
}

export interface Epub {
  metadata: EpubMetadata;
  manifest: EpubManifest;
}

@Injectable()
export class BooksService {
  constructor(private settingsService: SettingsService) {}

  public getBookType(bookname: string) {}

  public getBookCover(bf: Buffer) {
    console.log(bf);
  }

  public parseBook(content: Buffer): Epub {
    const zip = new AdmZip(content);
    const zipEntries = zip.getEntries();
    let res = {} as Epub;

    zipEntries.forEach((z) => {
      console.log(z.entryName);

      const entryData = z.getData();

      switch (z.entryName.split(path.sep).pop()) {
        case 'mimetype':
          this.parseMimetype(entryData);
          break;
        case 'content.opf':
          res = this.parseOPF(entryData);
          break;
        case 'toc.ncx':
          this.parseToc(entryData);
          break;
        case 'cover.jpg':
          console.log(
            '🚀 ~ file: books.service.ts:22 ~ BooksService ~ zipEntries.forEach ~ cover.jpg:',
            z.name,
          );
          this.getBookCover(entryData);
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
      // transformTagName: (tagName) => tagName.replace(/dc:/gi, ''),
    });

    const info = parser.parse(data);
    
    console.log("🚀 ~ file: books.service.ts:100 ~ BooksService ~ parseOPF ~ info:", info)

    return { ...info.package };
  }

  public saveBookToLibrary(files: Array<Express.Multer.File>) {
    const libPath = this.settingsService.getLibraryPath();
    const infos = [];

    files.forEach((file) => {
      const { originalname, mimetype, buffer, size } = file;

      infos.push({
        originalname,
        mimetype,
        size,
      });

      const book = this.parseBook(buffer);

      // console.log(
      //   '🚀 ~ file: books.service.ts:111 ~ BooksService ~ files.forEach ~ book:',
      //   book,
      // );

      fs.writeFileSync(path.join(libPath, originalname), file.buffer);
    });

    return {
      infos,
    };
  }
}
