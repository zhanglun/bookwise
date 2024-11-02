// data-access-layer.ts

import { BookRequestItem } from "@/interface/book";
import { ApiDataSource } from "./api";
import { PGLiteDataSource } from "./pglite";
import { DataSource, UploadFileBody, QueryBookFilter } from "./type";

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

  async saveBookAndRelations(model: BookRequestItem) {
    return this.dataSource.saveBookAndRelations(model);
  }

  async removeBookCache(book_uuid: string) {
    return this.dataSource.removeBookCache(book_uuid);
  }

  async getAuthors() {
    return this.dataSource.getAuthors();
  }
}

// usage

const config = {
  source: "pglite",
};

let dataSource;

if (config.source === "api") {
  dataSource = new ApiDataSource();
} else {
  dataSource = new PGLiteDataSource();
}

export const dal = DataAccessLayer.getInstance(dataSource as DataSource);
