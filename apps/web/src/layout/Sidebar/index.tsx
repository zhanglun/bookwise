import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { parseEpub } from "@/helpers/epub";
import { useBearStore } from "@/store";
import {
  DashboardIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { CategoryFilter } from "./category/CategoryFilter";
import { RouteConfig } from "@/config";
import { AuthorList } from "./category/AuthorList";

export const Sidebar = () => {
  const store = useBearStore((state) => ({
    settings: state.settings,
  }));
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
        const { metadata, coverPath } = bookPkg;
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
          authors: metadata.creator,
          publisher: metadata.publisher,
          publish_at: new Date(metadata.publish_at),
        };

        formData.append("files", file, metadata.title);
        formData.append("book", JSON.stringify(book));
        formData.append("cover", coverPath);

        // request
        //   .post("/books", book, {
        //     headers: { "Content-Type": "multipart/form-data" },
        //   })
        //   .then((res) => {
        //     console.log("🚀 ~ file: Toc.tsx:25 ~ useEffect ~ res:", res);
        //   });

        request
          .post("/books/upload/files", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            console.log("🚀 ~ file: Toc.tsx:25 ~ useEffect ~ res:", res);
          });
      };

      for (const file of files) {
        console.log("%c Line:83 🍤 file", "color:#465975", file);
        // formData.append("files", file);
        // formData.append("books", await parseEpub(file));
        // console.log("%c Line:72 🍢 formData", "color:#ea7e5c", formData);
        // console.log("🚀 ~ file: Toc.tsx:16 ~ useEffect ~ file:", file);
        fns.push(parseFileAndSaveIt(file));
      }
    }
  }, [files]);

  return (
    <div className="h-full w-[320px] flex flex-col gap-2 grid-in-left-sidebar">
      <div className="bg-cell text-cell-foreground rounded-md px-3 py-2">
        <NavLink
          to={RouteConfig.HOME}
          className="flex items-center gap-3 py-2 px-2 font-bold text-[var(--gray-11)] hover:text-[var(--gray-12)]"
        >
          <HomeIcon width={20} height={20} />
          <span>Home</span>
        </NavLink>
        <NavLink
          to={RouteConfig.SEARCH}
          className="flex items-center gap-3 py-2 px-2 font-bold text-[var(--gray-11)] hover:text-[var(--gray-12)]"
        >
          <MagnifyingGlassIcon width={20} height={20} />
          <span>Search</span>
        </NavLink>
      </div>
      <div className="flex-1 flex flex-col bg-cell text-cell-foreground rounded-md">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 py-1 px-2 font-bold text-gray-11 hover:text-gray-12">
            <DashboardIcon width={20} height={20} />
            <span>Library</span>
          </div>
          <div className="px-1 flex items-center">
            <Tooltip content="Add new book">
              <IconButton
                variant="ghost"
                radius="full"
                className="cursor-pointer"
              >
                <PlusCircledIcon
                  onClick={openFileDialog}
                  width={20}
                  height={20}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="px-3 py-1">
          <CategoryFilter />
        </div>
        <div>
          <AuthorList />
        </div>
      </div>
    </div>
  );
};
