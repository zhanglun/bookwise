import { NavLink } from "react-router-dom";
import { HomeIcon, LibraryIcon, Plus, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { parseEpub } from "@/helpers/epub";
import { useBearStore } from "@/store";
import { Switch } from "@radix-ui/themes";

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

  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);

    if (darkMode) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  };

  return (
    <div className="grid h-full w-[320px] gap-3">
      <div className="bg-cell text-cell-foreground rounded-md">
        <Switch onCheckedChange={toggleDarkMode} />
        <NavLink
          to={"/"}
          className="flex items-center gap-3 py-2 px-4 font-bold text-gray-11 hover:text-gray-12"
        >
          <HomeIcon size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink
          to={"/search"}
          className="flex items-center gap-3 py-2 px-4 font-bold text-gray-11 hover:text-gray-12"
        >
          <SearchIcon size={22} />
          <span>Search</span>
        </NavLink>
      </div>
      <div className="bg-cell text-cell-foreground rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 py-2 px-4 font-bold text-gray-11 hover:text-gray-12">
            <LibraryIcon />
            <span>Library</span>
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
