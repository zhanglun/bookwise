import { FilePlusIcon } from "@radix-ui/react-icons";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { getFileFormatType } from "@/helpers/epub";
import { toast } from "sonner";
import { BookRequestItem, BookResItem } from "@/interface/book";
import { Book } from "epubjs";
import { dal } from "@/dal";
import { UploadFileBody } from "@/dal/type";
import { useEffect } from "react";
import { IpcRendererEvent } from "electron";

async function formatMetadata(file: File): Promise<[BookRequestItem, string]> {
  const book = new Book(file as unknown as string);
  const opened = (await book.opened) as Book & { cover: string };
  const { cover, packaging } = opened;
  const { metadata } = packaging;

  return [
    {
      title: metadata.title,
      subject: "",
      description: metadata.description,
      contributor: "",
      identifier: metadata.identifier,
      source: "",
      rights: "",
      language: metadata.language,
      format: getFileFormatType(file),
      page_count: 0,
      isbn: "",
      authors: metadata.creator,
      publisher: metadata.publisher,
      publish_at: new Date(metadata.pubdate),
    },
    cover,
  ];
}

export interface UploaderProps {
  onSuccess: (book: BookResItem) => void;
}

async function fileReaderAsync(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
  });
}

async function readFiles(files: File[]) {
  const body: UploadFileBody[] = [];

  for (const file of files) {
    const [metadata, cover] = await formatMetadata(file);
    const buffer = await fileReaderAsync(file);
    body.push({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      buffer,
      metadata,
      cover,
    });
  }

  return body;
}

export const Uploader = (props: UploaderProps) => {
  const openFileDialog = (): void => {
    const input = document.createElement("input");

    input.type = "file";
    input.multiple = true;

    input.addEventListener(
      "change",
      async (e) => {
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const files = e.target.files;
          console.log(
            "🚀 ~ file: useBook.ts:9 ~ input.addEventListener ~ files:",
            files
          );

          const body = await readFiles(files);

          dal.uploadFile(body);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err) {
          console.log("🚀 ~ err:", err);
        }
      },
      false
    );
    console.log("🚀 ~ dal:", dal);

    input.click();
  };
  useEffect(() => {
    window.electronAPI.onUploadFileSuccess(
      async (_e: IpcRendererEvent, body) => {
        console.log(
          "🚀 ~ file: index.tsx:83 ~ window.electronAPI.onUploadFileSuccess ~ body:",
          body
        );
        const { model } = body;
        toast.promise(dal.saveBookAndRelations(model), {
          loading: `Uploading ${model.title}`,
          success: (data) => {
            console.log("%c Line:68 🍖 data", "color:#2eafb0", data);
            props.onSuccess(data);
            return ` Upload ${model.title} successful`;
          },
          error: (error) => {
            return `Upload Error, ${error?.message}`;
          },
        });
      }
    );
  }, []);

  return (
    <Tooltip content="Add new book">
      <IconButton
        variant="ghost"
        className="cursor-pointer"
        onClick={openFileDialog}
      >
        <FilePlusIcon width={18} height={18} />
      </IconButton>
    </Tooltip>
  );
};
