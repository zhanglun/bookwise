import { useEffect, useLayoutEffect, useRef } from "react";
import { getAbsoluteUrl } from "@/helpers/utils";
import { accessImage } from "@/helpers/parseEpub";
import { Board } from "@/pages/Reader/Board";
import CanvasHighlighter from "@/pages/Reader/Canvas";

export interface PageProps {
  ncxId: string;
  children?: any;
  content: string;
  bookInfo: any;
  ncxHref: string;
}

export function Page(props: PageProps) {
  const { ncxId, content, bookInfo, ncxHref } = props;
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

        await convertImages(files, ncxHref, images);
      }
    }

    init();
  }, [ content ]);

  useLayoutEffect(() => {
    setTimeout(() => {
      const container = document.getElementById(ncxId);
      const highlighter = new CanvasHighlighter(container);
      container.addEventListener("mouseup", () => {
        const range = highlighter.getSelectionRange();
        console.log(range);
        if (range) highlighter.addRange(range);
      },);
    }, 1000)

  }, [ ncxId ]);

  return <div id={ ncxId } data-ncx-id={ ncxId } key={ ncxId } className="relative">
    {/*<div className="absolute top-0 left-0 w-full h-full pointer-events-none">*/ }
    {/*  <Board/>*/ }
    {/*</div>*/ }
    <div ref={ DOMNodeRef }></div>
  </div>
}
