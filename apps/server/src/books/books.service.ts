import { Injectable } from '@nestjs/common';
import * as AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";

@Injectable()
export class BooksService {
  public parseBook(content: Buffer) {
    const zip = new AdmZip(content);
    const zipEntries = zip.getEntries();

    zipEntries.forEach((z) => {
      // console.log(z);
      const entryData = z.getData();
      switch (z.entryName) {
        case 'mimetype':
          this.parseMimetype(entryData);
          break;
        case 'content.opf':
          this.parseOPF(entryData);
          break;
        case 'cover.jpg':
          break;
        default:
          break;
      }
    });
  }

  public parseMimetype(bf: Buffer) {
    return bf.toString();
  }

  public parseOPF(bf: Buffer) {
    const data = bf.toString();
    const parser = new XMLParser({
      ignoreAttributes: false,
      transformTagName: (tagName) => tagName.replace(/dc:/gi, ''),
    });
    const info = parser.parse(data);

    return { ...info.package };
  }

  // public getContentOPF(content: string) {
  //
  // }
}
