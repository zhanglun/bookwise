import {
  BookPlus,
  Home,
  Library,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";
import clsx from "clsx";
import { NavItem } from "./NavItem";
import "./index.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useSelectFromDisk } from "@/hooks/useBook";
import { useEffect } from "react";
import { request } from "@/helpers/request";

export const Sidebar = () => {
  const [files, openFileDialog] = useSelectFromDisk();

  useEffect(() => {
    if (files.length) {
      const formData = new FormData();

      for (const file of files) {
        formData.append("files", file);
        console.log("🚀 ~ file: Toc.tsx:16 ~ useEffect ~ file:", file);
      }

      console.log("🚀 ~ file: Toc.tsx:13 ~ useEffect ~ formData:", formData);

      request
        .post("/books/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log("🚀 ~ file: Toc.tsx:25 ~ useEffect ~ res:", res);
        });
    }
  }, [files]);


  return (
    <div id="sidebar" className="overflow-hidden mt-4 h-full">
      <div className="w-full h-full flex flex-col justify-between">
        <div>
          <div className={clsx("side-menu-item", "")}>
            <Search size={16} />
          </div>
          {/* <NavItem to="/" title="Home" icon={ <Home size={ 16 }/> }/> */}
          <NavItem to="/library" title="Library" icon={<Library size={16} />} />
        </div>
        <div className={"pt-6"}>
          <div className={"side-menu-item"} onClick={openFileDialog}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <BookPlus size={20} className="text-indigo-500" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Start reading a new book</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <NavItem
            title={"Setting"}
            icon={<Settings size={16} />}
            to={"/settings"}
          />
        </div>
      </div>
    </div>
  );
};
