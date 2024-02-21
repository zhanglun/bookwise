import { useState, useEffect, useRef } from "react";
import { EpubObject, accessImage } from "@/helpers/epub";
import { getAbsoluteUrl } from "@/helpers/book";
import { Marker } from "@/helpers/marker";
import { JSZipObject } from "jszip";
import { MarkerToolbar } from "@/components/MakerToolbar";

export interface PageProps {
  idref: string;
  content: string;
  bookInfo: EpubObject;
  href: string;
  url: string;
}

export function PageCanvas(props: PageProps) {
  const { idref, content, bookInfo, href, url } = props;
  const [showToolbar, setShowToolbar] = useState(false);
  const DOMNodeRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<Marker>(Object.create({}));
  const convertImages = async (
    files: { [key: string]: JSZipObject },
    currentHref: string,
    images: NodeListOf<Element>
  ) => {
    for (const image of images) {
      let attr = "src";
      let href: string = image.getAttribute("src") || "";

      if (!href) {
        href = image.getAttribute("xlink:href") || "";
        attr = "xlink:href";
      }

      href = getAbsoluteUrl(currentHref, href);

      const name = href;

      if (files[name]) {
        const imageBlob = await accessImage(files[name], "image/jpeg");

        image.setAttribute(attr, URL.createObjectURL(imageBlob));
      }
    }
  };

  function handleSelectColor(color: string) {
    console.log("%c Line:33 🍞 color", "color:#b03734", color);
    const config = {
      rectFill: color,
      lineStroke: "green",
      strokeWidth: 3,
    };
    const mark = markerRef.current.getSelectionRange(null, config);

    console.log("%c Line:54 🍭 mark", "color:#7f2b82", mark);

    if (mark) markerRef.current.addMark(mark);

    window?.getSelection()?.removeAllRanges();
  }

  useEffect(() => {
    async function init() {
      const { files } = bookInfo;
      const parser = new DOMParser();
      const dom = parser.parseFromString(content, "text/html");
      const images = dom.querySelectorAll("img, image");

      await convertImages(files, href, images);

      const $box = document.querySelector(`#${idref}-box`);
      const childNodes = Array.from(dom.body.childNodes);

      childNodes.forEach((node) => {
        $box?.appendChild(node);
      });
    }

    init().then((res) => {
      if (DOMNodeRef.current) {
        markerRef.current = new Marker(DOMNodeRef.current);
      }
    });
  }, [content]);

  useEffect(() => {
    document.addEventListener("click", (event) => {
      // 通过传入点击位置获取 range id
      const id = markerRef.current.getMarkerIdByPointer(
        event.clientX,
        event.clientY
      );

      if (id) {
        const mark = markerRef.current.getMark(id);
        mark && markerRef.current.updateMark(mark);
      }
    });
  }, []);

  return (
    <div
      id={idref}
      data-spine-idref={idref}
      data-spine-href={href}
      data-spine-url={url}
      key={idref}
      className="min-h-[100vh] my-5 shadow-md relative"
    >
      <div className={"px-10 py-12 w-full min-h-full"} ref={DOMNodeRef}>
        <div id={`${idref}-box`}></div>
      </div>
    </div>
  );
}
