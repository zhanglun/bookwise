import Book from "epubjs";
import { request } from "@/helpers/request.ts";
import { memo, useEffect, useRef, useState } from "react";
import {
  accessPageContent,
  EpubObject,
  parseEpub,
  SpineItem,
} from "@/helpers/epub";
import { Toc } from "@/views/Viewer/Epub/Toc.tsx";
import {
  PageCanvas,
  PageCanvasRef,
  PageProps,
} from "@/views/Viewer/Epub/Canvas.tsx";
import { MarkerToolbar } from "@/components/MakerToolbar";
import { useBearStore } from "@/store";

export interface EpubViewerProps {
  uuid: string;
}

export const EpubViewer = memo(({ uuid }: EpubViewerProps) => {
  const [instance, setInstance] = useState<EpubObject>({} as EpubObject);
  const [pageList, setPageList] = useState<PageProps[]>([]);
  const pageRefs = useRef<{ [key: string]: PageCanvasRef }>({});
  const store = useBearStore((state) => ({
    interactiveObject: state.interactiveObject,
    updateInteractiveObject: state.updateInteractiveObject,
  }));

  function getEpubBlobs() {
    request
      .get(`books/${uuid}/blobs`, {
        responseType: "blob",
      })
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const instance = new Book(res.data);
        console.log("instance", instance);
        console.log(instance.navigation);
        return parseEpub(res.data);
      })
      .then((res) => {
        setInstance(res);
      });
  }

  const getBookAdditionalInfo = () => {
    request.get(`books/${uuid}/additional_infos`).then((res) => {
      console.log("%c Line:65 🥐 res", "color:#33a5ff", res);
    });
  };

  useEffect(() => {
    getEpubBlobs();
    getBookAdditionalInfo();
  }, [uuid]);

  useEffect(() => {
    const generateFullContent = async () => {
      const { files } = instance;
      const pages: any[] = [];

      const loopSpine = async (list: SpineItem[]) => {
        for (const item of list) {
          let { href, url } = item;

          if (href.indexOf("#") >= 0) {
            href = href.split("#")[0];
          }

          if (files[url]) {
            pages.push({
              idref: item.idref,
              bookInfo: instance,
              file: files[url],
              href,
              url,
            });
          }
        }
      };

      await loopSpine(instance.spine);

      setPageList(pages);
    };

    instance.spine && instance.spine.length > 0 && generateFullContent();
  }, [instance]);

  function handleSelectColor(color: string) {
    console.log("%c Line:33 🍞 color", "color:#b03734", color);
    const config = {
      rectFill: color,
      lineStroke: "green",
      strokeWidth: 3,
    };

    const { marker, selection } = store.interactiveObject[0];
    const mark = marker.getSelectionRange(selection, config);

    console.log("%c Line:54 🍭 mark", "color:#7f2b82", mark);

    if (mark) marker.addMark(mark);

    window?.getSelection()?.removeAllRanges();
  }

  useEffect(() => {
    function getSelectionParentElement() {
      function loop(el: any) {
        if (el.id === "book-section") {
          return el;
        }

        if (!el.dataset || !el.dataset.spineIdref) {
          return loop(el.parentNode);
        }

        return el;
      }

      let parentEl = null,
        sel;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel && sel.rangeCount) {
          parentEl = loop(sel.getRangeAt(0).commonAncestorContainer);
        }
      } else if ((sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
      }

      return parentEl;
    }

    function watchSelection() {
      const el = getSelectionParentElement();
      console.log("%c Line:131 🧀 el", "color:#2eafb0", el);
      const pageId = el.getAttribute("id");

      const pageForwardedRef = pageRefs.current[pageId]
      if (pageForwardedRef) {
        store.updateInteractiveObject([
          {
            marker: pageForwardedRef.marker,
            selection: window.getSelection(),
          },
        ]);
      }
    }

    document
      .getElementById("book-section")
      ?.addEventListener("mouseup", watchSelection);
  }, []);

  return (
    <div className={"grid grid-cols-[auto_1fr]"}>
      <div className={"fixed top-0 left-0 bottom-0 hidden"}>
        <Toc
          navigation={instance?.navigation}
          metadata={instance?.metadata}
          onItemClick={() => {}}
        />
      </div>
      <section className="" id="book-section">
        {pageList.slice(10, 12).map((page) => {
          return (
            <PageCanvas
              key={page.idref}
              ref={(ref) => (pageRefs.current[page.idref] = ref)}
              {...page}
            ></PageCanvas>
          );
        })}
      </section>
      <MarkerToolbar onSelectColor={handleSelectColor} />
    </div>
  );
});
