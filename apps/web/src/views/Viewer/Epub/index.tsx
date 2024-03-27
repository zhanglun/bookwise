import ePub, { Book, Contents, EpubCFI, Rendition } from "epubjs";
import { request } from "@/helpers/request.ts";
import { memo, useEffect, useRef, useState } from "react";
import { Toc } from "@/views/Viewer/Epub/Toc.tsx";
import { PageCanvasRef, PageProps } from "@/views/Viewer/Epub/Canvas.tsx";
import { MarkerToolbar, VirtualReference } from "@/components/MarkerToolbar";
import { useBearStore } from "@/store";
import { Mark, TextMark } from "@/helpers/marker/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Marker } from "@/helpers/marker";
import Section from "epubjs/types/section";

export interface EpubViewerProps {
  bookId: string;
}

export const EpubViewer = memo(({ bookId }: EpubViewerProps) => {
  const [book, setBook] = useState<Book>();
  const [rendition, setRendition] = useState<Rendition>();
  const [pageList, setPageList] = useState<PageProps[]>([]);
  const pageRefs = useRef<{ [key: string]: PageCanvasRef }>({});
  const store = useBearStore((state) => ({
    interactiveObject: state.interactiveObject,
    updateInteractiveObject: state.updateInteractiveObject,
  }));
  const [activatedMark, setActivatedMark] = useState<Mark | null>(null);
  const [interactiveSection, setInteractiveSection] = useState<Section>();
  const [interactiveWindow, setInteractiveWindow] = useState<Window>();
  const [virtualRef, setVirtualRef] = useState<VirtualReference | null>(null);
  const rootBoundary = useRef<Document>(Object.create({}));
  const markerRef = useRef<Marker>(Object.create({}));
  const [open, setOpen] = useState<boolean>(false);
  const [notesMap, setNotesMap] = useState<{ [key: number]: Mark[] }>({});

  function getEpubBlobs() {
    request
      .get(`books/${bookId}/blobs`, {
        responseType: "blob",
      })
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        const book = ePub(res.data);
        setBook(book);

        const rendition = book.renderTo("book-section", {
          flow: "scrolled-doc",
          width: "100%",
        });

        setRendition(rendition);

        const displayed = rendition.display();

        displayed.then(function (renderer) {
          console.log("%c Line:58 🌶 renderer", "color:#2eafb0", renderer);
        });
      });
  }

  const getBookAdditionalInfo = () => {
    request.get(`books/${bookId}`).then((res) => {
      console.log("%c Line:65 🥐 res", "color:#33a5ff", res);
    });
  };

  function getNotes() {
    request
      .get("/notes", {
        params: {
          filter: [`book_id:eq:${bookId}`, `content:like:要么`],
        },
      })
      .then((res) => {
        const { data: notes } = res;
        notes.forEach((note: Mark) => {
          note.position_metics = JSON.parse(note.position_metics);
          note.style_config = JSON.parse(note.style_config);

          notesMap[note.spine_index] = notesMap[note.spine_index] || [];
          notesMap[note.spine_index].push(note);
        });

        console.log("%c Line:71 🍰 notesMap", "color:#b03734", notesMap);

        setNotesMap({
          ...notesMap,
        });
      });
  }

  console.log("%c Line:82 🍓 notesMap", "color:#b03734", notesMap);

  useEffect(() => {
    if (bookId) {
      getNotes();
      getEpubBlobs();
      getBookAdditionalInfo();
    }
  }, [bookId]);

  function handleSelectColor(color: string) {
    const config = {
      rectFill: color,
      strokeWidth: 3,
    };

    // const { marker, selection } = store.interactiveObject[0];
    let mark = activatedMark;

    if (interactiveSection && interactiveWindow) {
      const { index: spineIndex, href: spineName } = interactiveSection;
      const marker = markerRef.current;
      const selection = interactiveWindow.getSelection();
      // console.log(selection)
      if (mark) {
        mark.style_config.rectFill = color;
        marker.updateMark(mark);
      } else {
        mark = marker.getSelectionRange(selection, config, {
          spine_index: spineIndex,
          spine_name: spineName,
        });
        if (mark) marker.addMark(mark);
      }

      console.log("%c Line:108 🍖 mark", "color:#e41a6a", mark);

      // if (mark) {
      //   request
      //     .post("/notes", {
      //       book_id: parseInt(bookId, 10),
      //       spine_index: mark.spine_index,
      //       spine_name: mark.spine_name,
      //       type: mark.type,
      //       title: mark.title,
      //       content: mark.content,
      //       position_metics: mark.position_metics,
      //       style_config: mark.style_config,
      //     })
      //     .then((res) => {
      //       console.log("%c Line:123 🌭 res", "color:#42b983", res);
      //     });
      // }
    }

    // window?.getSelection()?.removeAllRanges();
  }

  function handleStrokeChange(stroke: string) {
    // TODO:
    console.log("%c Line:163 🍌 stroke", "color:#2eafb0", stroke);
  }

  function getAbsoluteRectPosition(range: Range) {
    const ancestor = range.commonAncestorContainer;
    const iframes = document.getElementsByTagName("iframe");
    let iframe = null;

    for (let i = 0; i < iframes.length; i++) {
      const iframeDocument = iframes[i].contentWindow.document;

      if (iframeDocument.contains(ancestor)) {
        iframe = iframes[i];
      }
    }

    const rect = {
      x: 0,
      y: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    if (iframe) {
      const { x, y, top, right, bottom, left } = range.getBoundingClientRect();
      // console.log(
      //   "🚀 ~ getAbsoluteRectPosition ~ range.getBoundingClientRect():",
      //   range.getBoundingClientRect()
      // );
      // const framePos = iframe.getBoundingClientRect();
      // console.log(
      //   "🚀 ~ getAbsoluteRectPosition ~ iframe.getBoundingClientRect():",
      //   iframe.getBoundingClientRect()
      // );

      // rect.x = x + framePos.x;
      // rect.y = y + framePos.y;
      // rect.top = top + framePos.top;
      // rect.right = right + framePos.right;
      // rect.left = left + framePos.left;
      // rect.bottom = bottom + framePos.bottom;
      return {
        x,
        y,
        top,
        right,
        bottom,
        left,
      };
    }

    return rect;
  }

  function handleRenditionSelect(cfiRange: EpubCFI, contents: Contents) {
    console.log("%c Line:94 🍩 cfiRange", "color:#6ec1c2", cfiRange);
    console.log("%c Line:94 🥤 contents", "color:#fca650", contents);
    const { content, document, sectionIndex, window: contentWindow } = contents;
    console.log("%c Line:97 🍓 document", "color:#4fff4B", document);
    console.log("%c Line:97 🍪 content", "color:#ea7e5c", content);
    const currentSection = book?.spine.get(sectionIndex);
    console.log(
      "%c Line:103 🍷 currentSection",
      "color:#2eafb0",
      currentSection
    );

    setInteractiveSection(currentSection);
    setInteractiveWindow(contentWindow);

    if (currentSection) {
      const marker = markerRef.current;
      const { index: spineIndex, href: spineName } = currentSection;

      marker.changeRoot(content as HTMLElement);

      if (marker) {
        const selection = contentWindow.getSelection();
        let tempMark;
        if (selection) {
          tempMark = marker.textMarker.createRange(
            selection,
            { rectFill: "black", lineStroke: "red", strokeWidth: 3 },
            {
              spine_index: spineIndex,
              spine_name: spineName,
            }
          );

          const virtualRange = marker.getRangeFromMark(tempMark);
          console.log(
            "%c Line:197 🍌 virtualRange",
            "color:#6ec1c2",
            virtualRange
          );
          console.log(
            "%c Line:199 🍇 virtualRange?.getBoundingClientRect()",
            "color:#465975",
            virtualRange?.getBoundingClientRect()
          );

          console.log(
            "🚀 ~ handleRenditionSelect ~ virtualRange.getClientRects():",
            virtualRange.getClientRects()
          );

          const rect = getAbsoluteRectPosition(virtualRange) as DOMRect;

          console.log(
            "🚀 ~ handleRenditionSelect ~ virtualRange.rect():",
            rect
          );

          virtualRange &&
            setVirtualRef({
              getBoundingClientRect: () => rect,
              getClientRects: () => virtualRange.getClientRects(),
            });

          console.log("%c Line:193 🍧 tempMark", "color:#7f2b82", tempMark);
        }

        // const id = marker.getMarkIdByPointer(
        //   event.clientX,
        //   event.clientY
        // );

        // if (id) {
        //   const mark = pageForwardedRef.marker.getMark(id);
        //   console.log("%c Line:206 🥚 mark", "color:#e41a6a", mark);
        //   const virtualRange = pageForwardedRef.marker.getRangeFromMark(mark);

        //   virtualRange &&
        //     setVirtualRef({
        //       getBoundingClientRect: () =>
        //         virtualRange.getBoundingClientRect(),
        //       getClientRects: () => virtualRange.getClientRects(),
        //     });

        //   setActivatedMark(mark);
        //   setOpen(true);
        // } else {
        // setActivatedMark(null);
        // setVirtualRef(null);
        // setOpen(false);
        // }
      }
    }
  }

  const [prevLabel, setPrevLabel] = useState("");
  const [nextLabel, setNextLabel] = useState("");
  useEffect(() => {
    function nextPage() {
      rendition?.next();
    }

    function prevPage() {
      rendition?.prev();
    }

    const next = document.getElementById("next");
    const prev = document.getElementById("prev");

    next?.addEventListener("click", nextPage, false);
    prev?.addEventListener("click", prevPage, false);

    const keyListener = function (e) {
      // Left Key
      if ((e.keyCode || e.which) == 37) {
        prevPage();
      }

      // Right Key
      if ((e.keyCode || e.which) == 39) {
        nextPage();
      }
    };

    const initMarkerAndNotes = () => {
      // markerRef.current = new Marker
    };

    const injectKnovaInstance = () => {};

    rendition?.on("keyup", keyListener);
    rendition?.on("selected", handleRenditionSelect);

    rendition?.on("rendered", (section: Section) => {
      const nextSection = section.next();
      const prevSection = section.prev();

      if (nextSection && nextSection.href) {
        const nextNav = book?.navigation.get(nextSection.href);
        setNextLabel(`${nextNav?.label || "Next"} »`);
      } else {
        setNextLabel("");
      }

      if (prevSection && prevSection.href) {
        const prevNav = book?.navigation.get(prevSection.href);
        setPrevLabel(`« ${prevNav?.label || "Previous"}`);
      } else {
        setPrevLabel("");
      }

      // Add CFI fragment to the history
      //history.pushState({}, '', section.href);
      window.location.hash = "#/" + section.href;
    });

    rendition?.hooks.render.register(function (contents: Contents) {
      console.log("%c Line:355 🥓 contents", "color:#f5ce50", contents);
      const html = contents.document;
      console.log("%c Line:357 🍯 html", "color:#7f2b82", html);
    });

    document.addEventListener("keyup", keyListener, false);

    const hash = window.location.hash.slice(2);

    rendition?.display(hash || undefined);

    return function () {
      rendition?.off("keyup", keyListener);
      rendition?.off("selected", handleRenditionSelect);

      document.addEventListener("keyup", keyListener, false);
    };
  }, [rendition]);

  useEffect(() => {
    const root = document.getElementById("canvasRoot") as HTMLElement;
    const el = document.getElementById("canvas") as HTMLElement;

    markerRef.current = new Marker(root, el);
  }, []);

  return (
    <div className={"bg-gray-100"}>
      <div className={"fixed top-0 left-0 bottom-0"}>
        {/* <Toc
          navigation={instance?.navigation}
          metadata={instance?.metadata}
          onItemClick={() => {}}
        /> */}
      </div>
      <div className="w-[100vw] px-[60px] relative" id="canvasRoot">
        <div className="max-w-[1028px] relative">
          <section className="w-full h-full py-10" id="book-section"></section>
          <div
            id="canvas"
            className="absolute top-10 left-0 right-0 bottom-10 pointer-events-none mix-blend-multiply"
          ></div>
        </div>
        <div className="flex items-center justify-between">
          <span id="prev" className="">
            {prevLabel}
          </span>
          <span id="next" className="">
            {nextLabel}
          </span>
        </div>
      </div>
      <MarkerToolbar
        open={open}
        onVirtualRefChange={() => {}}
        virtualRef={virtualRef}
        onStrokeChange={handleStrokeChange}
        onSelectColor={handleSelectColor}
      />
    </div>
  );
});
