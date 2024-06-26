
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { EpubObject, accessImage, accessPageContent } from "@/helpers/epub";
import { getAbsoluteUrl } from "@/helpers/book";
import { Marker } from "@/helpers/marker";
import { JSZipObject } from "jszip";
import { Mark } from "@/helpers/marker/types.ts";

export interface ContentProps {
  idref: string;
  bookInfo: EpubObject;
  file: JSZipObject;
  spineIndex: number;
  href: string;
  absoluteUrl: string;
  notes: Mark[];
}

export interface PageCanvasRef {
  marker: Marker;
  DOMNode: HTMLDivElement | null;
  selection: Selection | null;
  pageId: string;
  spineIndex: number;
  absoluteUrl: string;
}

export const Content = React.memo(
  forwardRef<PageCanvasRef, ContentProps>((props: ContentProps, forwardedRef) => {
    const { idref, bookInfo, file, href, spineIndex, absoluteUrl, notes } =
      props;
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

      if (DOMNodeRef.current) {
        markerRef.current = new Marker(DOMNodeRef.current);
      }

      init().then(() => {
        console.log("init page content done!!!");
      });
    }, [file]);

    useEffect(() => {
      setTimeout(() => {
        console.log("%c Line:103 🍧 notes", "color:#465975", notes);
        notes && notes.length && markerRef.current.renderRanges(notes);
      }, 3000);
    }, [notes]);

    useImperativeHandle(forwardedRef, () => ({
      DOMNode: DOMNodeRef.current,
      marker: markerRef.current,
      selection: selectionRef.current,
      pageId: idref,
      spineIndex: spineIndex,
      absoluteUrl: absoluteUrl,
    }));

    return (
      <div
        id={idref}
        data-spine-idref={idref}
        data-spine-index={spineIndex}
        data-spine-href={href}
        data-spine-absolute-url={absoluteUrl}
        key={idref}
        className="relative"
        ref={DOMNodeRef}
      >
        <div className={"px-10 py-12 w-full min-h-[100vh] bg-app"}>
          <div id={`${idref}-box`}></div>
        </div>
      </div>
    );
  })
);
