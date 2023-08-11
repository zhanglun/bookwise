import { request } from "@/helpers/request";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BookCatalog,
  accessFileContent,
  accessImage,
  parseEpub,
} from "@/helpers/parseEpub";
import { Catalog } from "./Catalog";

export const Reader = () => {
  const location = useLocation();
  const { state } = location;
  const [bookInfo, setBookInfo] = useState<any>({});
  const [catalog, setCatalog] = useState<BookCatalog[]>([]);
  const [content, setContent] = useState<string>("");
  const styleRef = useRef<HTMLStyleElement>(null);

  const getBookDetail = () => {
    request
      .get(`books/${state.book_id}/blobs`, {
        responseType: "blob",
      })
      .then((res) => {
        return parseEpub(res.data);
      })
      .then((infos) => {
        console.log("%c Line:20 🍖 infos", "color:#2eafb0", infos);
        setBookInfo(infos);
        setCatalog(infos.catalog);
      });
  };

  useEffect(() => {
    getBookDetail();
  }, []);

  useEffect(() => {
    const loadCSS = async () => {
      const { files } = bookInfo;

      if (!files) {
        return;
      }

      let cssText = "";

      for (const [key, file] of Object.entries(files)) {
        if (key.split(".").pop() === "css") {
          cssText += await accessFileContent(file as any, "text/css");
          cssText += "\n";
        }
      }

      if (styleRef.current) {
        styleRef.current.innerText = cssText;
      }
    };

    loadCSS();
  }, [bookInfo]);

  const convertImages = async (
    files: any,
    images: NodeListOf<HTMLImageElement>
  ) => {
    for (const image of images) {
      const name = new URL(image.src).pathname.slice(1);
      const imageBlob = await accessImage(files[name]);

      // 创建 FileReader 对象读取 Blob 数据
      const reader = new FileReader();
      reader.onload = (function (img) {
        return function (event) {
          const dataURL = event?.target?.result;

          img.src = dataURL || "";
        };
      })(image);

      reader.readAsDataURL(imageBlob);
    }
  };

  const goToPage = useCallback(
    async (id: string, href: string) => {
      console.log("%c Line:35 🥥 id", "color:#e41a6a", id, href);
      const { files } = bookInfo;
      console.log("%c Line:37 🥐 files", "color:#2eafb0", files[href]);

      if (files[href]) {
        const xml = await accessFileContent(files[href], "text/html");
        const parser = new DOMParser();
        const content = parser.parseFromString(xml, "application/xhtml+xml");
        const box = document.createElement("div");
        const body = content.querySelector("body");

        // parse Images
        if (body) {
          const images = body?.querySelectorAll("img");
          await convertImages(files, images);
          
          setTimeout(() => {
            box.innerHTML += body.innerHTML;
            setContent(box.innerHTML || "");
          }, 10)
        }

      }
    },
    [bookInfo]
  );

  return (
    <div className="h-full">
      <Catalog data={catalog} onGoToPage={goToPage} />
      <div className="h-full overflow-y-scroll px-4 rounded-lg bg-white/50 shadow-sm border border-[#efefef] border-opacity-60">
        <div className="flex-1 max-w-4xl px-4 sm:px-4 py-10 m-auto">
          <style type="text/css" ref={styleRef} />
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>
    </div>
  );
};
