// data-access-layer.ts

import { BookMetadata } from '@/interface/book';
import { ApiDataSource } from './api';
import { PGLiteDataSource } from './pglite';
import { DataSource, QueryBookFilter, UploadFileBody } from './type';

let instance: DataAccessLayer;

export class DataAccessLayer {
  constructor(private dataSource: DataSource) {}

  static getInstance(dataSource: DataSource) {
    if (!instance) {
      instance = new DataAccessLayer(dataSource);
    }
    return instance;
  }

  async uploadFile(body: UploadFileBody[]) {
    return this.dataSource.uploadFile(body);
  }

  async getRecentAdding(filter: QueryBookFilter) {
    return this.dataSource.getBooks(filter);
  }

  async getRecentReading(filter: QueryBookFilter) {
    return this.dataSource.getBooks(filter);
  }

  async getBooks(filter: QueryBookFilter) {
    return this.dataSource.getBooks(filter);
  }

  async getBookByUuid(uuid: string) {
    return this.dataSource.getBookByUuid(uuid);
  }

  async getBookBlob(uuid: string) {
    const result = await this.dataSource.getBookBlob(uuid);
    return { uuid, data: result };
  }

  async saveBookAndRelations(model: BookMetadata, file: Uint8Array, cover: Uint8Array | null) {
    return this.dataSource.saveBookAndRelations(model, file, cover);
  }

  async removeBook(uuid: string) {
    console.log('DAL: removeBook called, uuid:', uuid);
    console.log('DAL: dataSource type:', this.dataSource.constructor.name);
    console.log('DAL: dataSource.removeBook exists:', typeof this.dataSource.removeBook);
    const result = await this.dataSource.removeBook(uuid);
    console.log('DAL: removeBook result:', result);
    return result;
  }

  async removeBookCache(book_uuid: string) {
    return this.dataSource.removeBookCache(book_uuid);
  }

  async getAuthors() {
    return this.dataSource.getAuthors();
  }

  async getPublishers() {
    return this.dataSource.getPublishers();
  }

  async getLanguages() {
    return this.dataSource.getLanguages();
  }

  async updateBook(model: { uuid: string } & Partial<BookMetadata>) {
    return this.dataSource.updateBook(model);
  }
}

// usage

const config = {
  source: 'pglite',
};

let dataSource;

if (config.source === 'api') {
  dataSource = new ApiDataSource();
} else {
  dataSource = new PGLiteDataSource();
}

export const dal = DataAccessLayer.getInstance(dataSource as DataSource);
