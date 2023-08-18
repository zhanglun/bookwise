import { request } from "@/helpers/request";
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import {
  BookCatalog,
  accessFileContent,
  accessImage,
  parseEpub,
  accessPageContent,
} from "@/helpers/parseEpub";
import { Catalog } from "./Catalog";
import { getAbsoluteUrl } from "@/helpers/utils";

export const Reader = () => {
  const location = useLocation();
  const { state } = location;
  const [bookInfo, setBookInfo] = useState<any>({
    packaging: { metadata: {} },
    catalog: [],
  });
  const [catalog, setCatalog] = useState<BookCatalog[]>([]);
  const [content, setContent] = useState<string>("");
  const [currentHref, setCurrentHref] = useState<string>("");
  const [currentId, setCurrentId] = useState<string>("");
  const styleRef = useRef<HTMLStyleElement>(null);
  const [fullContent, setFullContent] = useState("");

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
    console.log("%c Line:51 🍊 getBookDetail();", "color:#465975");
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
    currentHref: string,
    images: NodeListOf<Element>
  ) => {
    console.log("%c Line:82 🍫 files", "color:#33a5ff", files);
    console.log("%c Line:86 🥑 images", "color:#42b983", images);

    for (const image of images) {
      let attr = "src";
      let href: string = image.getAttribute("src") || "";

      if (!href) {
        href =
          image.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "";
        attr = "href";
      }

      if (!href) {
        href = image.getAttribute("xlink:href") || "";
        attr = "xlink:href";
      }

      href = getAbsoluteUrl(currentHref, href);
      const name = href;

      if (files[name]) {
        console.log("🚀 ~ file: index.tsx:74 ~ Reader ~ name:", name);
        const imageBlob = await accessImage(files[name]);

        // 创建 FileReader 对象读取 Blob 数据
        const reader = new FileReader();
        reader.onload = (function (img) {
          return function (event) {
            const dataURL = event?.target?.result;

            img.setAttribute(attr, (dataURL || "") as string);
          };
        })(image);

        reader.readAsDataURL(imageBlob);
      }
    }
  };

  // const goToPage = useCallback(
  //   async (href: string, id?: string) => {
  //     const { files } = bookInfo;
  //     let anchorId: string;

  //     if (href.indexOf("#") >= 0) {
  //       href = href.split("#")[0];
  //       anchorId = href.split("#")[0];
  //     }

  //     if (files[href]) {
  //       const box = document.createElement("div");
  //       const body = await accessPageContent(files[href]);

  //       if (body) {
  //         const images = body?.querySelectorAll("img, image");
  //         await convertImages(files, href, images);

  //         setTimeout(() => {
  //           box.innerHTML += body.innerHTML;
  //           setContent(box.innerHTML || "");
  //         }, 10);
  //       }
  //     }
  //   },
  //   [bookInfo]
  // );

  const goToPage = (href: string, id: string) => {
    const target = document.getElementById(id);
    console.log("%c Line:149 🥔 target", "color:#33a5ff", target);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserClickEvent = (e: MouseEvent<HTMLElement>) => {
    let elem = null;
    const i = e.nativeEvent.composedPath();

    for (let a = 0; a <= i.length - 1; a++) {
      const s = i[a] as HTMLElement;

      if ("A" === s.tagName) {
        elem = s;
        break;
      }
    }

    if (elem && elem.getAttribute("href")) {
      e.preventDefault();
      e.stopPropagation();

      const href = elem.getAttribute("href") || "";
      const id = elem.dataset.anchorId || "";

      if (
        href &&
        (href.indexOf("http://") >= 0 ||
          href.indexOf("https://") >= 0 ||
          href.indexOf("www.") >= 0)
      ) {
        // TODO: open in browser
      } else {
        const realHref = getAbsoluteUrl(currentHref, href);
        console.log(realHref);

        goToPage(realHref, id);
      }
    }
    // if (elem && (e.preventDefault(),
    //     $(r).attr("href"))) {
    //   t.stopPropagation();
    //   var o = $(r).attr("href")
    //       , g = o.indexOf("http://")
    //       , A = o.indexOf("https://")
    //       , c = o.indexOf("www.");
    //   if (console.log($(r).attr("data-nr-type")),
    //       $(r).attr("data-nr-type")) {
    //     var l = $(r).attr("data-nr-type");
    //     "webpage" === l && window.WebAppApi.showNRWebPage(o),
    //     "video" === l && window.WebAppApi.showNRVideoPlayer(o),
    //     "audio" === l && window.WebAppApi.showNRAudioPlayer(o),
    //     "quiz" === l && window.WebAppApi.showNRQuizPage(o)
    //   } else if (g >= 0 || A >= 0 || c >= 0)
    //     window.WebAppApi.openPageInBrowser(o);
    //   else {
    //     console.log("内部链接", o);
    //     var I = $(r).parents(".nr_spine_section").attr("spinehref")
    //         , h = C.getAbsoluteUrl(I, o);
    //     0 === o.indexOf("#") && (h = I + o),
    //         window.WebAppApi.showContentLoader(),
    //         e.jumpToPositionByHref(h, function() {
    //           window.WebAppApi.hideContentLoader(),
    //               window.WebAppApi.onPaginationChanged()
    //         })
    //   }
    //   return !1
    // }
  };

  useEffect(() => {
    const generateFullContent = async () => {
      const { files, catalog } = bookInfo;
      console.log("%c Line:212 🥟 catalog", "color:#4fff4B", catalog);
      const box = document.createElement("div");

      const loopCatalog = async (list: BookCatalog[]) => {
        for (const item of list) {
          let { href } = item;
          let anchorId: string;

          if (href.indexOf("#") >= 0) {
            href = href.split("#")[0];
            anchorId = href.split("#")[0];
          }

          if (files[href]) {
            const part = document.createElement("div");
            const body = await accessPageContent(files[href]);

            part.id = item.id;

            if (body) {
              const images = body?.querySelectorAll("img, image");
              await convertImages(files, href, images);

              part.innerHTML += body.innerHTML;
              box.appendChild(part);
            }

            if (item.subitems) {
              await loopCatalog(item.subitems);
            }
          }
        }
      };

      await loopCatalog(catalog);

      setTimeout(() => {
        setFullContent(box.innerHTML);
      }, 10);
    };

    bookInfo && generateFullContent();
  }, [bookInfo]);
  return (
    <div className="h-full">
      <Catalog
        data={catalog}
        packaging={bookInfo.packaging}
        onGoToPage={async (href: string, id: string) => {
          setCurrentHref(href);
          setCurrentId(id);
          await goToPage(href, id);
        }}
      />
      <div className="h-full overflow-y-scroll px-4 rounded-lg bg-white/50 shadow-sm border border-[#efefef] border-opacity-60">
        <div
          className="flex-1 max-w-4xl px-4 sm:px-4 py-10 m-auto"
          onClick={handleUserClickEvent}
        >
          <style type="text/css" ref={styleRef} />
          <div dangerouslySetInnerHTML={{ __html: fullContent }}></div>
        </div>
      </div>
    </div>
  );
};
