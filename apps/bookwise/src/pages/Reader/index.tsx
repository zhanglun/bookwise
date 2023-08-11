import { request } from "@/helpers/request";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BookCatalog, accessFileContent, parseEpub } from "@/helpers/parseEpub";
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

  console.log("%c Line:4 🍭 location", "color:#b03734", location);

  const goToPage = useCallback(
    async (id: string, href: string) => {
      console.log("%c Line:35 🥥 id", "color:#e41a6a", id, href);
      const { files } = bookInfo;
      console.log("%c Line:37 🥐 files", "color:#2eafb0", files[href]);

      if (files[href]) {
        const xml = await accessFileContent(files[href], "text/html");
        const parser = new DOMParser();
        const content = parser.parseFromString(xml, "application/xhtml+xml");
        console.log("%c Line:44 🍏 content", "color:#4fff4B", content);
        const box = document.createElement("div");
        const styles = content.querySelectorAll('link[type="text/css"]');
        console.log("%c Line:48 🥛 styles", "color:#465975", styles);
        const body = content.querySelector("body");

        if (styles) {
          [].map.call(styles, async (style: HTMLLinkElement) => {
            const href = style.href;

            if (href) {
              console.log("%c Line:57 🍐 href", "color:#33a5ff", href);
              const cssFileContent = await accessFileContent(files[href]);
              console.log(
                "%c Line:58 🍯 cssFileContent",
                "color:#ffdd4d",
                cssFileContent
              );
            }
          });
          // box.innerHTML += [].reduce.call(styles, (acu, cur: Element) => {
          //   acu += cur.innerHTML;

          //   return acu;
          // }, '');
        }

        if (body) {
          box.innerHTML += body.innerHTML;
        }

        setContent(box.innerHTML || "");
      }
    },
    [bookInfo]
  );

  return (
    <div className="h-full">
      <Catalog data={catalog} onGoToPage={goToPage} />
      <div className="h-full overflow-y-scroll px-4 rounded-lg bg-white/50 shadow-sm border border-[#efefef] border-opacity-60">
        <div className="max-w-4xl px-4 flex-1 sm:px-4">
          <style type="text/css" ref={styleRef} />
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>
    </div>
  );
};
