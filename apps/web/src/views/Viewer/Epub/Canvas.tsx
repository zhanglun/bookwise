import { useCallback, useEffect, useRef, useState } from "react";
import HTMLReactParser from "html-react-parser";
import { accessFileContent, accessImage } from "@/helpers/epub";
import { getAbsoluteUrl } from "@/helpers/book";

export interface PageProps {
  idref: string;
  children?: any;
  content: string;
  bookInfo: any;
  href: string;
  url: string;
}

export function PageCanvas(props: PageProps) {
  const { idref, content, bookInfo, href, url } = props;
  const DOMNodeRef = useRef<HTMLDivElement>(null);
  const [ size, setSize ] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const convertImages = async (
    files: any,
    currentHref: string,
    images: NodeListOf<Element>
  ) => {
    console.log("🚀 ~ Page ~ files:", files);
    for (const image of images) {
      let attr = "src";
      let href: string = image.getAttribute("src") || "";

      if (!href) {
        href = image.getAttribute("xlink:href") || "";
        attr = "xlink:href";
      }

      href = getAbsoluteUrl(currentHref, href);

      console.log("href ===>", href);

      const name = href;

      if (files[name]) {
        const imageBlob = await accessImage(files[name], "image/jpeg");

        console.log("image", image);
        console.log("attr", attr);
        console.log(
          "URL.createObjectURL(imageBlob)",
          URL.createObjectURL(imageBlob)
        );

        image.setAttribute(attr, URL.createObjectURL(imageBlob));
      }
    }
  };

  useEffect(() => {
    async function init() {
      const { files } = bookInfo;
      const parser = new DOMParser();
      const dom = parser.parseFromString(content, "text/html");
      // parsedDOMRef.current = dom;
      const images = dom.querySelectorAll("img, image");

      console.log("🚀 ~ init ~ images:", images);

      await convertImages(files, href, images);

      const $box = document
        .querySelector(`#${ idref }-box`);
      const childNodes = Array.from(dom.body.childNodes);

      childNodes.forEach(node => {
        $box.appendChild(node);
      });
    }

    init().then((res) => {
      const width = DOMNodeRef.current?.offsetWidth;
      const height = DOMNodeRef.current?.offsetHeight;

      setSize({ width, height });
    });
  }, [ content ]);

  return (
    <div
      id={ idref }
      data-spine-idref={ idref }
      data-spine-href={ href }
      data-spine-url={ url }
      key={ idref }
      className="min-h-[100vh] my-5 shadow-md"
    >
      <div className={ "px-10 py-12 w-full min-h-full absolute left-[-9999px]" }>
        <div ref={ DOMNodeRef } className={ "page-content" }></div>
      </div>
      <div className={ "px-10 py-12 w-full min-h-full" }>
        <div id={ `${ idref }-box` }></div>
      </div>
    </div>
  );
}
