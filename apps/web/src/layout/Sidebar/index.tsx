import { NavLink } from "react-router-dom";
import { LibraryIcon, Plus } from "lucide-react";
import { Button, Tooltip } from "@nextui-org/react";
import { useEffect } from "react";
import { request } from "@/helpers/request";

export const Sidebar = () => {

  const [files, openFileDialog] = useSelectFromDisk();

  useEffect(() => {
    if (files.length) {
      const formData = new FormData();

      for (const file of files) {
        formData.append("files", file);
        console.log("🚀 ~ file: index.tsx:16 ~ useEffect ~ file:", file);
      }

      console.log("🚀 ~ file: index.tsx:13 ~ useEffect ~ formData:", formData);

      request
        .post("/books/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log("🚀 ~ file: index.tsx:25 ~ useEffect ~ res:", res);
        });
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
            <Tooltip content={"Add new book"}>
              <Plus />
            </Tooltip>
          </div>
          <div>
            <Button>add new book</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
