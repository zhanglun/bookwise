import { Injectable } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';

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

interface Epub {
  metadata: EpubMetadata;
  manifest: EpubManifest;
}

@Injectable()
export class BooksService {
  public parseBook(content: Buffer): Epub {
    const zip = new AdmZip(content);
    const zipEntries = zip.getEntries();
    let res = {} as Epub;

    zipEntries.forEach((z) => {
      console.log(z.entryName);

      const entryData = z.getData();
      switch (z.entryName) {
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

    return { ...info.package };
  }
}
