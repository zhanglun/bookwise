/* eslint-disable react-hooks/exhaustive-deps */
import ePub, { Book } from "epubjs";
import Section from "epubjs/types/section";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { MarkerToolbar, VirtualReference } from "@/components/MarkerToolbar";
import { request } from "@/helpers/request.ts";
import { Mark, TextMark } from "@/helpers/marker/types";
import { Marker } from "@/helpers/marker";
import { substitute } from "@/helpers/epub";
import { ScrollArea, Spinner } from "@radix-ui/themes";
import { ContentRender } from "./ContentRender";
import { BookResItem } from "@/interface/book";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { getAbsoluteUrl } from "@/helpers/book";
import { ViewerLayout } from "../Layout";
import { useBearStore } from "@/store";
import { dal } from "@/dal";

export interface EpubViewerProps {
  bookUuid: string;
}

export const EpubViewer = memo(({ bookUuid }: EpubViewerProps) => {
  const store = useBearStore((state) => ({
    currentTocItem: state.currentTocItem,
  }));
  const [book, setBook] = useState<Book>();
  const [bookDetail, setBookDetail] = useState<BookResItem>({} as BookResItem);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activatedMark, setActivatedMark] = useState<Mark | null>(null);
  const [virtualRef, setVirtualRef] = useState<VirtualReference | null>(null);
  const markerRef = useRef<Marker>(Object.create({}));
  const [open, setOpen] = useState<boolean>(false);
  const [notesMap, setNotesMap] = useState<{ [key: number]: Mark[] }>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<Section>();
  const [content, setContent] = useState<string>("");

  function getBookDetail() {
    return dal.getBookByUuid(bookUuid).then((data) => {
      setBookDetail(data);

      return data;
    });
  }

  function getNotes() {
    request
      .get("/notes", {
        params: {
          // filter: [`book_id:eq:${bookUuid}`, `content:like:要么`],
          filter: [`book_id:eq:${bookUuid}`],
        },
      })
      .then((res) => {
        const { data: notes } = res;

        notes.forEach((note: Mark) => {
          note.position_metrics = JSON.parse(note.position_metrics);
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

  const display = (index: number, book?: Book, anchorId?: string) => {
    setLoading(true);

    const section = book?.spine.get(index);

    if (section && book) {
      setCurrentSection(section);
      setContent("");

      const p = section.load(book.load.bind(book));

      // @ts-expect-error library typed error
      p.then((content: HTMLElement) => {
        if (content && content.innerHTML) {
          // const styles = content.querySelectorAll('[type="text/css"]');

          // styles.forEach((s: Element) => s.remove());

          // @ts-expect-error library typed error
          const { urls, replacementUrls } = book.resources;
          const str = substitute(content.innerHTML, urls, replacementUrls);

          setContent(str);
          setCurrentSectionIndex(index);

          setTimeout(() => {
            if (anchorId) {
              const target = document.getElementById(anchorId);

              target?.scrollIntoView();
            } else {
              scrollAreaRef.current && scrollAreaRef.current.scrollTo(0, 0);
            }

            setLoading(false);

            const progress = scrollAreaRef?.current?.scrollTop || 0;

            updateReadProgress(index, progress);
          });
        }
      });
    }

    return section;
  };

  const onReadLocalFileSuccess = useCallback(() => {
    console.log(
      "🚀 ~ file: index.tsx:41 ~ onReadLocalFileSuccess ~ onReadLocalFileSuccess:",
      onReadLocalFileSuccess
    );
    // window.electronAPI.onReadLocalFileSuccess(
    //   async (_event: unknown, blob: Blob) => {
    //     const book = ePub(blob as unknown as ArrayBuffer);
    //     console.log(
    //       "🚀 ~ file: index.tsx:44 ~ window.electronAPI.onReadLocalFileSuccess ~ blob:",
    //       blob
    //     );
    //     setBook(book);

    //     if (book) {
    //       book.opened.then(function () {
    //         const spine_index = "0";

    //         // if (detail.additional_infos) {
    //         //   spine_index = detail.additional_infos.spine_index;
    //         // }

    //         display(parseInt(spine_index || "0", 10), book);
    //         setCurrentSection(book.spine.get(spine_index));
    //       });
    //     }
    //   }
    // );
  }, []);

  function updateReadProgress(spine_index: number, read_progress: number) {
    const body = {
      spine_index: spine_index.toString(),
      read_progress,
      read_progress_updated_at: new Date(),
    };

    request
      .post(`/books/${bookUuid}/additional_infos`, {
        ...body,
      })
      .then((res) => {
        console.log("%c Line:126 🍎 res", "color:#fca650", res);
      });
  }

  const nextPage = () => {
    display(currentSectionIndex + 1, book);
  };

  const prevPage = () => {
    display(currentSectionIndex - 1, book);
  };

  useEffect(() => {
    const keyListener = function (e: KeyboardEvent) {
      if ((e.keyCode || e.which) === 37) {
        prevPage();
      }

      if ((e.keyCode || e.which) === 39) {
        nextPage();
      }
    };

    document.addEventListener("keyup", keyListener, false);

    return function () {
      document.addEventListener("keyup", keyListener, false);
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById("canvasRoot") as HTMLElement;
    const el = document.getElementById("canvas") as HTMLDivElement;

    markerRef.current = new Marker(root, el);
  }, []);

  useEffect(() => {
    if (bookUuid) {
      console.log("🚀 ~ file: index.tsx:195 ~ useEffect ~ bookUuid:", bookUuid);
      Promise.all([
        // getNotes(),
        getBookDetail(),
      ]).then(
        ([detail]: [
          // NoteResItem[],
          BookResItem
        ]) => {
          const { path } = detail;
          console.log("🚀 ~ file: index.tsx:205 ~ useEffect ~ detail:", detail);
          window.electronAPI.readLocalFile({ path });
        }
      );
    }
  }, [bookUuid]);

  function handleSelectColor(color: string) {
    const config = {
      rectFill: color,
      strokeWidth: 3,
    };

    if (currentSection) {
      const {
        idref: pageId,
        index: spineIndex,
        href: spineName,
      } = currentSection;

      let mark = activatedMark;

      if (mark) {
        mark.style_config.rectFill = color;
        markerRef.current.updateMark(mark);
      } else {
        mark = markerRef.current.getSelectionRange(document.selection, config, {
          spine_index: parseInt(spineIndex, 10),
          spine_name: spineName,
        });

        if (mark) markerRef.current.addMark(mark);
      }

      console.log("%c Line:108 🍖 mark", "color:#e41a6a", mark);

      if (mark) {
        request
          .post("/notes", {
            book_id: parseInt(bookUuid, 10),
            spine_index: mark.spine_index,
            spine_name: mark.spine_name,
            type: mark.type,
            title: mark.title,
            content: mark.content,
            position_metrics: mark.position_metrics,
            style_config: mark.style_config,
          })
          .then((res) => {
            console.log("%c Line:123 🌭 res", "color:#42b983", res);
          });
      }
    }

    window?.getSelection()?.removeAllRanges();
  }

  useEffect(() => {
    function activeToolbar(event: any) {
      console.log("activeToolbar currentSection", currentSection);

      if (currentSection) {
        const {
          idref: pageId,
          spineIndex,
          spineHref: spineName,
        } = currentSection;

        const selection = window.getSelection();
        let tempMark;

        if (selection) {
          tempMark = markerRef.current.textMarker.createRange(
            selection,
            { rectFill: "black", lineStroke: "red", strokeWidth: 3 },
            {
              spine_index: spineIndex,
              spine_name: spineName,
            }
          );
          //
          // setVirtualRef({
          // 	getBoundingClientRect: () =>
          // 		selection.getRangeAt(0).getBoundingClientRect(),
          // 	getClientRects: () => selection.getRangeAt(0).getClientRects(),
          // });
          //
          // setOpen(true);
        } else {
          const id = markerRef.current.getMarkIdByPointer(
            event.clientX,
            event.clientY
          );

          if (id) {
            const mark = markerRef.current.getMark(id);
            console.log("%c Line:206 🥚 mark", "color:#e41a6a", mark);
            const virtualRange = markerRef.current.getRangeFromMark(mark);

            virtualRange &&
              setVirtualRef({
                getBoundingClientRect: () =>
                  virtualRange.getBoundingClientRect(),
                getClientRects: () => virtualRange.getClientRects(),
              });

            setActivatedMark(mark);
            setOpen(true);
          } else {
            setActivatedMark(null);
            setVirtualRef(null);
            setOpen(false);
          }
        }
      }
    }

    document
      .getElementById("book-section")
      ?.addEventListener("mouseup", activeToolbar);

    return () => {
      document
        .getElementById("book-section")
        ?.removeEventListener("mouseup", activeToolbar);
    };
  }, [currentSection]);

  useEffect(() => {
    if (notesMap && currentSection) {
      setTimeout(() => {
        const { index } = currentSection;
        const notes = notesMap[index];

        console.log("%c Line:103 🍧 notes", "color:#465975", notes);

        notes && notes.length && markerRef.current.renderRanges(notes);
      }, 16);
    }
  }, [notesMap, currentSection]);

  useEffect(() => {
    if (!store.currentTocItem) {
      return;
    }

    const { href } = store.currentTocItem;
    const section = book?.spine.get(href);

    if (section) {
      setCurrentSection(section);
      setCurrentSectionIndex(section.index as number);
      display(section.index, book);
    }
  }, [store.currentTocItem]);

  function handleUserClickEvent(e: React.MouseEvent<HTMLElement>) {
    let elem = null;
    const i = e.nativeEvent.composedPath();

    console.log("🚀 ~ handleUserClickEvent ~ i:", i);

    for (let a = 0; a <= i.length - 1; a++) {
      const s = i[a] as HTMLElement;

      if ("A" === s.tagName) {
        elem = s;
        break;
      }
    }

    if (elem && elem.getAttribute("href")) {
      e.preventDefault();
      e.stopPropagation();

      const href = elem.getAttribute("href") || "";

      if (
        href &&
        (href.indexOf("http://") >= 0 ||
          href.indexOf("https://") >= 0 ||
          href.indexOf("www.") >= 0)
      ) {
        window.open(href);
      } else if (currentSection) {
        const realHref = getAbsoluteUrl(currentSection?.href, href);
        const [hrefId, anchorId] = realHref.split("#");
        const section = book?.spine.get(hrefId);

        if (section) {
          setCurrentSection(section);
          setCurrentSectionIndex(section.index as number);
          display(section.index, book, anchorId);
        }
      }
    }
    // if (elem && (e.preventDefault(),
    //     $(r).attr("href"))) {
    //   t.stopPropagation();
    //   var o = $(r).attr("href")
    //       , g = o.indexOf("http://")
    //       , A = o.indexOf("https://")
    //       , c = o.indexOf("www.");
    //   if (console.log($(r).attr("data-nr-type")),
    //       $(r).attr("data-nr-type")) {
    //     var l = $(r).attr("data-nr-type");
    //     "webpage" === l && window.WebAppApi.showNRWebPage(o),
    //     "video" === l && window.WebAppApi.showNRVideoPlayer(o),
    //     "audio" === l && window.WebAppApi.showNRAudioPlayer(o),
    //     "quiz" === l && window.WebAppApi.showNRQuizPage(o)
    //   } else if (g >= 0 || A >= 0 || c >= 0)
    //     window.WebAppApi.openPageInBrowser(o);
    //   else {
    //     console.log("内部链接", o);
    //     var I = $(r).parents(".nr_spine_section").attr("spinehref")
    //         , h = C.getAbsoluteUrl(I, o);
    //     0 === o.indexOf("#") && (h = I + o),
    //         window.WebAppApi.showContentLoader(),
    //         e.jumpToPositionByHref(h, function() {
    //           window.WebAppApi.hideContentLoader(),
    //               window.WebAppApi.onPaginationChanged()
    //         })
    //   }
    //   return !1
    // }
  }

  return (
    <ViewerLayout
      book={bookDetail}
      navigation={book?.navigation}
      metadata={book?.packaging?.metadata}
      area={
        <ScrollArea
          id="canvasRoot"
          size="1"
          type="hover"
          scrollbars="vertical"
          ref={scrollAreaRef}
          className="h-[calc(100vh-68px)] px-6 relative"
        >
          {loading && (
            <div className="absolute z-40 top-6 right-6 bottom-6 left-6 bg-cell flex items-center justify-center rounded-lg">
              <Spinner size="3" />
            </div>
          )}
          <div className="relative m-auto max-w-[1200px] bg-cell text-cell-foreground my-6 mb-30 rounded-lg">
            <div className="relative m-auto max-w-[980px] px-[60px] pb-20 mb-20">
              <section
                className="py-16 w-full h-full"
                id="book-section"
                onClick={handleUserClickEvent}
              >
                <ContentRender contentString={content} />
              </section>
            </div>
          </div>
          <span
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 px-2 py-16 rounded-md cursor-pointer transition-all text-[var(--gray-10)] hover:text-[var(--gray-12)] hover:bg-[var(--gray-3)]"
            onClick={() => prevPage()}
          >
            <ChevronLeftIcon width={22} height={22} />
          </span>
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 px-2 py-16 rounded-md cursor-pointer transition-all text-[var(--gray-10)] hover:text-[var(--gray-12)] hover:bg-[var(--gray-3)]"
            onClick={() => nextPage()}
          >
            <ChevronRightIcon width={22} height={22} />
          </span>
          <div
            id="canvas"
            className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none mix-blend-multiply"
          />
        </ScrollArea>
      }
    ></ViewerLayout>
  );
});
