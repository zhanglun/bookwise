import { BookPlus } from "lucide-react";
import { Book } from "@/components/Book";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectFromDisk } from "@/hooks/useBook";
import { useEffect } from "react";
import { request } from "@/helpers/request";

export const Library = () => {
  const [files, openFileDialog, uploadFiles] = useSelectFromDisk();

  useEffect(() => {
    if (files.length) {
      const formData = new FormData();

      for (const file of files) {
        formData.append('files', file);
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
    <div className="max-w-5xl m-auto  grid grid-flow-row gap-3">
      <div className="px-3 pt-7 pb-2 text-2xl font-bold text-stone-900">
        Library
      </div>
      <div className="px-3 py-3 space-x-3">
        <div
          className="border border-stone-200 rounded-lg pl-6 py-3 w-[340px] flex items-center space-x-3 hover:bg-stone-100"
          onClick={() => openFileDialog()}
        >
          <BookPlus size={20} className="text-indigo-500" />
          <div className="grid grid-flow-row">
            <span className="text-sm font-bold text-stone-700">New Book</span>
            <span className="text-[10px] text-stone-500">
              Start reading a new book
            </span>
          </div>
        </div>
      </div>
      <div className="px-3 py-2"></div>
      <div className="px-3 py-2 grid grid-flow-col grid-cols-5 gap-5">
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
      </div>
    </div>
  );
};
