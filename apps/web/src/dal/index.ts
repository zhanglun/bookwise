// data-access-layer.ts

import { ApiDataSource } from "./api";
import { PGLiteDataSource } from "./pglite";
import { DataSource, UploadFileBody } from "./type";

let instance: DataAccessLayer;

export class DataAccessLayer {
  constructor(private dataSource: DataSource) {}

  static getInstance(dataSource: DataSource) {
    if (!instance) {
      instance = new DataAccessLayer(dataSource);
    }
    return instance;
  }

  async uploadFile(body: UploadFileBody) {
    return this.dataSource.uploadFile(body);
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
