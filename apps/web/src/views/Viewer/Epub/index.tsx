/* eslint-disable react-hooks/exhaustive-deps */
import ePub, { Book, NavItem } from "epubjs";
import Section from "epubjs/types/section";
import { memo, useEffect, useRef, useState } from "react";
import { Toc } from "@/views/Viewer/Epub/Toc.tsx";
import { MarkerToolbar, VirtualReference } from "@/components/MarkerToolbar";
import { request } from "@/helpers/request.ts";
import { Mark, TextMark } from "@/helpers/marker/types";
import { Marker } from "@/helpers/marker";
import { substitute } from "@/helpers/epub";
import { MenuBar } from "./MenuBar";
import { ScrollArea, Spinner } from "@radix-ui/themes";
import { ContentRender } from "./ContentRender";
import { BookResItem, NoteResItem } from "@/interface/book";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { getAbsoluteUrl } from "@/helpers/book";

export interface EpubViewerProps {
  bookId: string;
}

export const EpubViewer = memo(({ bookId }: EpubViewerProps) => {
  const [book, setBook] = useState<Book>();
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

  function getBookBlobs() {
    return request
      .get(`books/${bookId}/blobs`, {
        responseType: "blob",
      })
      .then((res) => {
        return ePub(res.data);
      });
  }

  function getBookDetail() {
    return request.get(`books/${bookId}`).then((res) => {
      return res.data;
    });
  }

  function getNotes() {
    request
      .get("/notes", {
        params: {
          // filter: [`book_id:eq:${bookId}`, `content:like:要么`],
          filter: [`book_id:eq:${bookId}`],
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
          const styles = content.querySelectorAll('[type="text/css"]');

          styles.forEach((s: Element) => s.remove());

          // @ts-expect-error library typed error
          const { urls, replacementUrls } = book.resources;
          const str = substitute(content.innerHTML, urls, replacementUrls);

          // remove internal css styles
          str.replace(/<link[^>]*type="text\/css"[^>]*>/ig, '')

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

  function updateReadProgress(spine_index: number, read_progress: number) {
    const body = {
      spine_index: spine_index.toString(),
      read_progress,
      read_progress_updated_at: new Date(),
    };

    request
      .post(`/books/${bookId}/additional_infos`, {
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
    if (bookId) {
      Promise.all([
        // getNotes(),
        getBookBlobs(),
        getBookDetail(),
      ]).then(
        ([
          // _notes,
          bookRes,
          detail,
        ]: [
          // NoteResItem[],
          Book,
          BookResItem
        ]) => {
          setBook(bookRes);
          const { spine_index } = detail.additional_infos;
          if (bookRes) {
            bookRes.opened.then(function () {
              display(parseInt(spine_index || "0", 10), bookRes);
              setCurrentSection(bookRes.spine.get(spine_index));
            });
          }
        }
      );
    }
  }, [bookId]);

  useEffect(() => {}, [book]);

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
            book_id: parseInt(bookId, 10),
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

  function handleTocItemClick(item: NavItem) {
    const { href } = item;
    const section = book?.spine.get(href);

    if (section) {
      setCurrentSection(section);
      setCurrentSectionIndex(section.index as number);
      display(section.index, book);
    }
  }

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
        const realHref = getAbsoluteUrl(currentSection?.url, href);
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
    <div className="text-foreground bg-app grid w-full h-full grid-cols-[260px_1fr] grid-areas-view gap-2 p-2">
      <Toc
        navigation={book?.navigation}
        metadata={book?.packaging?.metadata}
        onItemClick={handleTocItemClick}
        className="grid-in-left-toc"
      />
      <ScrollArea
        id="canvasRoot"
        size="1"
        type="hover"
        scrollbars="vertical"
        ref={scrollAreaRef}
        className="grid-in-content rounded-lg relative bg-cell text-cell-foreground h-full"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50">
          <MenuBar />
        </div>
        {loading && (
          <div className="absolute z-40 top-0 right-0 bottom-0 left-0 bg-cell flex items-center justify-center">
            <Spinner size="3" />
          </div>
        )}
        <div className="relative m-auto max-w-[1200px]">
          <div className="relative m-auto max-w-[980px] px-[60px]">
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
      {/* <MarkerToolbar
        open={open}
        onVirtualRefChange={() => {}}
        virtualRef={virtualRef}
        onStrokeChange={handleStrokeChange}
        onSelectColor={handleSelectColor}
      /> */}
    </div>
  );
});
