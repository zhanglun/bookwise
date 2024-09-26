import { BookRequestItem } from "@/interface/book";

export interface UploadFileBody {
  file: string;
  metadata: BookRequestItem;
  cover: string;
}

export interface DataSource {
  uploadFile: (body: UploadFileBody) => Promise<void>;
}
