import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { EpubObject, accessImage, accessPageContent } from "@/helpers/epub";
import { getAbsoluteUrl } from "@/helpers/book";
import { Marker } from "@/helpers/marker";
import { JSZipObject } from "jszip";
import { useBearStore } from "@/store";

export interface PageProps {
  idref: string;
  bookInfo: EpubObject;
  file: JSZipObject;
  href: string;
  url: string;
}

export interface PageCanvasRef {
  marker: Marker;
  DOMNode: HTMLDivElement | null;
  selection: Selection | null;
  pageId: string;
  url: string;
}

export const PageCanvas = forwardRef<PageCanvasRef, PageProps>(
  (props: PageProps, forwardedRef) => {
    const { idref, bookInfo, file, href, url } = props;
    const store = useBearStore((state) => ({
      updateInteractiveObject: state.updateInteractiveObject,
    }));
    const DOMNodeRef = useRef<HTMLDivElement | null>(null);
    const selectionRef = useRef<Selection | null>(null);
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

    useEffect(() => {
      async function init() {
        const body = await accessPageContent(file);
        const content = body?.innerHTML;

        if (content) {
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
      }

      init().then(() => {
        if (DOMNodeRef.current) {
          markerRef.current = new Marker(DOMNodeRef.current);
        }
      });
    }, [file]);

    useImperativeHandle(forwardedRef, () => ({
      DOMNode: DOMNodeRef.current,
      marker: markerRef.current,
      selection: selectionRef.current,
      pageId: idref,
      url: url,
    }));

    return (
      <div
        id={idref}
        data-spine-idref={idref}
        data-spine-href={href}
        data-spine-url={url}
        key={idref}
        className="min-h-[100vh] my-5 shadow-md relative"
        ref={DOMNodeRef}
      >
        <div className={"px-10 py-12 w-full min-h-full"}>
          <div id={`${idref}-box`}></div>
        </div>
      </div>
    );
  }
);
