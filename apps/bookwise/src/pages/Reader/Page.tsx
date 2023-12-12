import { useEffect, useLayoutEffect, useRef } from "react";
import { getAbsoluteUrl } from "@/helpers/utils";
import { accessImage } from "@/helpers/parseEpub";
import { Board } from "@/pages/Reader/Board";
import CanvasHighlighter from "@/pages/Reader/Canvas";

export interface PageProps {
  idref: string;
  children?: any;
  content: string;
  bookInfo: any;
  href: string;
}

export function Page(props: PageProps) {
  const { idref, content, bookInfo, href } = props;
  const DOMNodeRef = useRef<any>(null);
  const convertImages = async (
    files: any,
    currentHref: string,
    images: NodeListOf<Element>
  ) => {
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

  useEffect(() => {
    async function init() {
      if (DOMNodeRef.current) {
        DOMNodeRef.current.innerHTML = content;

        const { files } = bookInfo;
        const images = DOMNodeRef.current.querySelectorAll("img, image");

        await convertImages(files, href, images);
      }
    }

    init();
  }, [ content ]);

  useLayoutEffect(() => {
    setTimeout(() => {
      const container = document.getElementById(idref);
      const highlighter = new CanvasHighlighter(container);
      container.addEventListener("mouseup", () => {
        const range = highlighter.getSelectionRange();
        console.log(range);
        if (range) highlighter.addRange(range);
      },);
    }, 1000)

  }, [ idref ]);

  return <div id={ idref } data-spineidref={ idref } data-spinehref={ href } key={ idref }
              className="relative px-10 py-12 min-h-[100vh] my-5 shadow-md">
    {/*<div className="absolute top-0 left-0 w-full h-full pointer-events-none">*/ }
    {/*  <Board/>*/ }
    {/*</div>*/ }
    <div ref={ DOMNodeRef }></div>
  </div>
}
