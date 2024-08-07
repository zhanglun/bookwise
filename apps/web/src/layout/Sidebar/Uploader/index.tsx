import { PlusCircledIcon } from "@radix-ui/react-icons";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { getFileFormatType, parseEpub } from "@/helpers/epub";
import { toast } from "sonner";
import { request } from "@/helpers/request";
import { BookRequestItem, BookResItem } from "@/interface/book";

async function createFilesMeta(file: File): Promise<[BookRequestItem, string]> {
  const bookInstance = await parseEpub(file);
  const { metadata, coverPath } = bookInstance;

  return [
    {
      title: metadata.title,
      subject: metadata.subject,
      description: metadata.description,
      contributor: metadata.contributor,
      source: "",
      rights: "",
      language: metadata.language,
      format: getFileFormatType(file),
      page_count: 0,
      isbn: "",
      authors: metadata.creator,
      publisher: metadata.publisher,
      publish_at: new Date(metadata.publish_at),
    },
    coverPath,
  ];
}


export interface UploaderProps {
  onSuccess: (book: BookResItem) => void
}

export const Uploader = (props: UploaderProps) => {
  const openFileDialog = (): void => {
    const input = document.createElement("input");

    input.type = "file";
    input.multiple = true;

    input.addEventListener(
      "change",
      async (e) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const files = e.target.files;
        console.log(
          "🚀 ~ file: useBook.ts:9 ~ input.addEventListener ~ files:",
          files
        );

        for (const file of files) {
          console.log("%c Line:83 🍤 file", "color:#465975", file);
          const [book, coverPath] = await createFilesMeta(file);
          console.log("%c Line:55 🌭 book", "color:#6ec1c2", book);

          const formData = new FormData();
          formData.append("files", file, book.title);
          formData.append("book", JSON.stringify(book));
          formData.append("cover", coverPath);

          toast.promise(
            request.post("/books/upload/files", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            }),
            {
              loading: `Uploading ${book.title}`,
              success: ({ data }) => {
                console.log("%c Line:68 🍖 data", "color:#2eafb0", data);
                props.onSuccess(data);
                return ` Upload ${book.title} successful`;
              },
              error: ({ data }) => {
                return `Upload Error, ${data.message}`;
              },
            }
          );
        }
      },
      false
    );

    input.click();
  };

  // useEffect(() => {
  //   if (files.length) {
  //     const formData = new FormData();
  //     const fns = [];

  //     const parseFileAndSaveIt = async (file: File) => {
  //       const bookPkg = await ePub(file);
  //       const { metadata } = bookPkg;
  //       const book = {
  //         title: metadata.title,
  //         cover: "",
  //         subject: metadata.subject,
  //         description: metadata.description,
  //         contributor: metadata.contributor,
  //         source: "",
  //         language: metadata.language,
  //         format: "",
  //         page_count: 0,
  //         isbn: "",
  //         authors: metadata.creator,
  //         publisher: metadata.publisher,
  //         publish_at: new Date(metadata.publish_at),
  //       };

  //       formData.append("files", file, metadata.title);
  //       formData.append("book", JSON.stringify(book));

  //       // request
  //       //   .post("/books", book, {
  //       //     headers: { "Content-Type": "multipart/form-data" },
  //       //   })
  //       //   .then((res) => {
  //       //     console.log("🚀 ~ file: Toc.tsx:25 ~ useEffect ~ res:", res);
  //       //   });

  //       // request
  //       //   .post("/books/upload/files", formData, {
  //       //     headers: { "Content-Type": "multipart/form-data" },
  //       //   })
  //       //   .then((res) => {
  //       //     console.log("🚀 ~ file: Toc.tsx:25 ~ useEffect ~ res:", res);
  //       //   });
  //     };

  //     for (const file of files) {
  //       console.log("%c Line:83 🍤 file", "color:#465975", file);
  //       fns.push(parseFileAndSaveIt(file));
  //     }
  //   }
  // }, [files]);

  return (
    <Tooltip content="Add new book">
      <IconButton variant="ghost" radius="full" className="cursor-pointer">
        <PlusCircledIcon onClick={openFileDialog} width={20} height={20} />
      </IconButton>
    </Tooltip>
  );
};
