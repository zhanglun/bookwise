import { NavLink } from "react-router-dom";
import { LibraryIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { Book } from "epubjs";
import { parseEpub } from "@/helpers/epub";

export const Sidebar = () => {
  const [files, setFiles] = useState<File[]>([]);

  const openFileDialog = (): void => {
    const input = document.createElement("input");

    input.type = "file";
    input.multiple = true;

    input.addEventListener(
      "change",
      (e) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const files = e.target.files;
        console.log(
          "🚀 ~ file: useBook.ts:9 ~ input.addEventListener ~ files:",
          files
        );
        setFiles(files);
      },
      false
    );

    input.click();
  };

  useEffect(() => {
    if (files.length) {
      const formData = new FormData();
      const fns = [];

      const parseFileAndSaveIt = async (file: File) => {
        const bookPkg = await parseEpub(file);

        const { metadata } = bookPkg;
        const book = {
          title: metadata.title,
          cover: "",
          subject: metadata.subject,
          description: metadata.description,
          contributor: metadata.contributor,
          source: "",
          language: metadata.language,
          format: "",
          page_count: 0,
          isbn: "",
          path: "",
          publish_at: metadata.publish_at,
          authors: metadata.creator,
        };

        formData.append("files", file);
        formData.append("books", book);

        request
          .post("/books", book, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            console.log("🚀 ~ file: Toc.tsx:25 ~ useEffect ~ res:", res);
          });
      };

      for (const file of files) {
        // formData.append("files", file);
        // formData.append("books", await parseEpub(file));
        // console.log("%c Line:72 🍢 formData", "color:#ea7e5c", formData);
        // console.log("🚀 ~ file: Toc.tsx:16 ~ useEffect ~ file:", file);
        fns.push(parseFileAndSaveIt(file));
      }

      // Promise.all(fns).then((res) => {
      //   console.log("%c Line:47 🌭 res", "color:#ea7e5c", res);
      // });

      // request
      //   .post("/books/upload", formData, {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   })
      //   .then((res) => {
      //     console.log("🚀 ~ file: Toc.tsx:25 ~ useEffect ~ res:", res);
      //   })
    }
  }, [files]);

  return (
    <div className="grid h-full w-[320px] gap-3">
      <div className=" bg-panel rounded-md">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/search"}>Search</NavLink>
      </div>
      <div className=" bg-panel rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <LibraryIcon />
            Library
          </div>
          <div>
            <div className="tooltip" data-tip="Add new book">
              <Plus onClick={openFileDialog} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
