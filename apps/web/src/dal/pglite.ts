import { DataSource, UploadFileBody } from "./type";

export class PGLiteDataSource implements DataSource {
  async uploadFile(body: UploadFileBody) {
    console.log("🚀 ~ PGLiteDataSource ~ uploadFile ~ body:", body);
    await window.electronAPI?.uploadFile(body);
  }
}
