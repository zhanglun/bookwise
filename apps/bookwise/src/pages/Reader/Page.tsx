import { useCallback, useEffect, useRef, useState } from "react";
import HTMLReactParser from "html-react-parser";
import { getAbsoluteUrl } from "@/helpers/utils";
import { accessImage } from "@/helpers/parseEpub";

export interface PageProps {
  idref: string;
  children?: any;
  content: string;
  bookInfo: any;
  href: string;
  url: string;
}

export function Page(props: PageProps) {
  const { idref, content, bookInfo, href, url } = props;
  const DOMNodeRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const convertImages = async (
    files: any,
    currentHref: string,
    images: NodeListOf<Element>
  ) => {
    console.log("🚀 ~ Page ~ files:", files)
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

      console.log(href)

      const name = href;

      if (files[name]) {
        const imageBlob = await accessImage(files[name]);

        console.log('imageBlob', imageBlob)

        // 创建 FileReader 对象读取 Blob 数据
        const reader = new FileReader();
        reader.onload = (function (img) {
          return function (event) {
            const dataURL = event?.target?.result;

            console.log("dataURL ===>", dataURL)

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

        console.log("🚀 ~ init ~ images:", images)

        await convertImages(files, href, images);
      }
    }

    init().then((res) => {
      const width = DOMNodeRef.current.offsetWidth;
      const height = DOMNodeRef.current.offsetHeight;

      setSize({ width, height });
    });
  }, [content]);

  const renderView = () => {
    return (
      <div className={"px-10 py-12 w-full min-h-full"}>
        <div id={idref}>{HTMLReactParser(content)}</div>
      </div>
    );
  };

  return (
    <div
      id={idref}
      data-spine-idref={idref}
      data-spine-href={href}
      data-spine-url={url}
      key={idref}
      className="min-h-[100vh] my-5 shadow-md"
    >
      <div className={"px-10 py-12 w-full min-h-full absolute left-[-9999px]"}>
        <div ref={DOMNodeRef} className={"page-content"}></div>
      </div>
      {renderView()}
    </div>
  );
}
