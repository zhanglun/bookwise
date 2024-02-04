import { NavLink } from "react-router-dom";
import { LibraryIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getBookInfoFromFileData } from "@/helpers/epub";

export const Sidebar = () => {
  const [ files, setFiles ] = useState<File[]>([]);

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

  // function saveFileAsBook (file: File) {
  //   const bookInfo = getBookInfoFromFileData(file);
  // }

  useEffect(() => {
    if (files.length) {

      for (const file of files) {
        console.log("🚀 ~ file: Toc.tsx:16 ~ useEffect ~ file:", file);
        // const bookInfo = getBookInfoFromFileData(file);
      }
    }
  }, [ files ]);

  return (
    <div className="grid h-full w-[320px] gap-3">
      <div className=" bg-panel rounded-md">
        <NavLink to={ "/" }>Home</NavLink>
        <NavLink to={ "/search" }>Search</NavLink>
      </div>
      <div className=" bg-panel rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <LibraryIcon/>
            Library
          </div>
          <div>
            <div className="tooltip" data-tip="Add new book">
              <Plus onClick={ openFileDialog }/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
