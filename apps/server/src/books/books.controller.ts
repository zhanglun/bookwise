import { Controller, Get, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from "@nestjs/platform-express";
import { unzip } from "node:zlib";
import * as AdmZip from 'adm-zip';
console.log("%c Line:5 🥤 AdmZip", "color:#f5ce50", AdmZip);

@Controller('books')
export class BooksController {
  @Get()
  findAll(): [] {
    return [];
  }

  @Post()
  addOne(): any {
    return [];
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    const { originalname, mimetype, buffer, size } = files[0];
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    console.log(zipEntries.length)

    zipEntries.forEach((z) => {
      console.log(z.toString())
    })
    return {
      body,
      file: {
        originalname, mimetype, size,
      }
    }
  }
}

