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
  const [virtualRef, setVirtualRef] = useState<VirtualReference | null>(null);
  const markerRef = useRef<{ [key: number]: Marker }>(Object.create({}));
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
          manager: "continuous",
          flow: "paginated",
          width: "100%",
          height: "100%",
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
    const parent = getSelectionParentElement();

    if (parent?.dataset?.spineIdref) {
      const pageId = parent.dataset.spineIdref;
      const spineIndex = parent.dataset.spineIndex;
      const spineName = parent.dataset.spineHref;
      const pageForwardedRef = pageRefs.current[pageId];
      const { marker, selection } = pageForwardedRef;

      if (mark) {
        mark.style_config.rectFill = color;
        marker.updateMark(mark);
      } else {
        mark = marker.getSelectionRange(selection, config, {
          spine_index: parseInt(spineIndex, 10),
          spine_name: spineName,
        });

        if (mark) marker.addMark(mark);
      }

      console.log("%c Line:108 🍖 mark", "color:#e41a6a", mark);

      if (mark) {
        request
          .post("/notes", {
            book_id: parseInt(bookId, 10),
            spine_index: mark.spine_index,
            spine_name: mark.spine_name,
            type: mark.type,
            title: mark.title,
            content: mark.content,
            position_metics: mark.position_metics,
            style_config: mark.style_config,
          })
          .then((res) => {
            console.log("%c Line:123 🌭 res", "color:#42b983", res);
          });
      }
    }

    window?.getSelection()?.removeAllRanges();
  }

  function handleStrokeChange(stroke: string) {
    // TODO:
    console.log("%c Line:163 🍌 stroke", "color:#2eafb0", stroke);
  }

  function handleRenditionSelect(cfiRange: EpubCFI, contents: Contents) {
    console.log("%c Line:94 🍩 cfiRange", "color:#6ec1c2", cfiRange);
    console.log("%c Line:94 🥤 contents", "color:#fca650", contents);
    const { content, document, sectionIndex } = contents;
    console.log("%c Line:97 🍓 document", "color:#4fff4B", document);
    console.log("%c Line:97 🍪 content", "color:#ea7e5c", content);
    const currentSection = book?.spine.get(sectionIndex);
    console.log(
      "%c Line:103 🍷 currentSection",
      "color:#2eafb0",
      currentSection
    );
    // const marker = new Marker(content as HTMLElement);
    console.log("%c Line:111 🍋 marker", "color:#f5ce50", marker);
  }

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

    rendition?.on("keyup", keyListener);
    rendition?.on("selected", handleRenditionSelect);

    rendition?.on("rendered", () => {
      console.log(
        "%c Line:213 🥔 rendition.getContents()",
        "color:#3f7cff",
        rendition.getContents()
      );

      const contents = rendition.getContents();
      console.log("%c Line:211 🍯 contents", "color:#e41a6a", contents);

      [].forEach.call(contents, (c) => {
        const { sectionIndex, content } = c;
        console.log("%c Line:220 🍉 content", "color:#4fff4B", content);

        if (!markerRef.current[sectionIndex]) {
          markerRef.current[sectionIndex] = new Marker(content);
        }
      })

      // console.log("%c Line:218 🍧 markerRef.current", "color:#465975", markerRef.current);
      // // TODO: reset marker

      // initMarkerAndNotes();
    });

    // rendition?.hooks.content.register(function (contents: Contents) {
    //   const body = contents.content as HTMLBodyElement;
    //   const el = document.createElement("div");
    //   el.className = "canvas-container";
    //   el.style.position = "absolute";
    //   el.style.top = "0";
    //   el.style.left = "0";
    //   el.style.right = "0";
    //   el.style.bottom = "0";
    //   el.style.pointerEvents = "none";
    //   el.style.mixBlendMode = "multiply";

    //   body.style.position = "relative";
    //   body.appendChild(el);

    // });

    document.addEventListener("keyup", keyListener, false);

    return function () {
      rendition?.off("keyup", keyListener);
      rendition?.off("selected", handleRenditionSelect);

      document.addEventListener("keyup", keyListener, false);
    };
  }, [rendition]);

  return (
    <div className={"bg-gray-100"}>
      <div className={"fixed top-0 left-0 bottom-0"}>
        {/* <Toc
          navigation={instance?.navigation}
          metadata={instance?.metadata}
          onItemClick={() => {}}
        /> */}
      </div>
      <div className="w-[100vw] px-[60px]">
        <span id="prev" className="absolute top-1/2 right-[10px[] w-[40px]">
          <ChevronLeft></ChevronLeft>
        </span>
        <section className="w-full h-[100vh]" id="book-section"></section>
        <span id="next" className="absolute top-1/2 right-[10px] w-[40px]">
          <ChevronRight></ChevronRight>
        </span>
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
