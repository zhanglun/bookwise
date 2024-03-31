/* eslint-disable react-hooks/exhaustive-deps */
import ePub, { Book, Contents, EpubCFI, Rendition } from "epubjs";
import { request } from "@/helpers/request.ts";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Toc } from "@/views/Viewer/Epub/Toc.tsx";
import { PageCanvasRef, PageProps } from "@/views/Viewer/Epub/Canvas.tsx";
import { MarkerToolbar, VirtualReference } from "@/components/MarkerToolbar";
import { useBearStore } from "@/store";
import { Mark, TextMark } from "@/helpers/marker/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Marker } from "@/helpers/marker";
import Section from "epubjs/types/section";
import { JSZipObject } from "jszip";
import {accessPageContent, substitute} from "@/helpers/epub";
import Url from "epubjs/types/utils/url";

export interface EpubViewerProps {
  bookId: string;
}

export const EpubViewer = memo(({ bookId }: EpubViewerProps) => {
  const [book, setBook] = useState<Book>();
  const store = useBearStore((state) => ({
    interactiveObject: state.interactiveObject,
    updateInteractiveObject: state.updateInteractiveObject,
  }));
  const [URLCache, setURLCache] = useState<{[key: string]: string}>({});
  const [files, setFiles] = useState<{[key: string]: JSZipObject}>({});
  const [virtualRef, setVirtualRef] = useState<VirtualReference | null>(null);
  const markerRef = useRef<Marker>(Object.create({}));
  const [open, setOpen] = useState<boolean>(false);
  const [notesMap, setNotesMap] = useState<{ [key: number]: Mark[] }>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<Section>();
  const [content, setContent] = useState<string>("");

  function getEpubBlobs() {
    request
      .get(`books/${bookId}/blobs`, {
        responseType: "blob",
      })
      .then((res) => {
        const book = ePub(res.data);

        setBook(book);
        
        if (book.archived) {
          setFiles(book.archive.zip.files);
          setURLCache(book.archive.urlCache);
        }
      });
  }

  function getBookAdditionalInfo() {
    request.get(`books/${bookId}`).then((res) => {
      console.log("%c Line:65 🥐 res", "color:#33a5ff", res);
    });
  }

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

  useEffect(() => {
    if (bookId) {
      getNotes();
      getEpubBlobs();
      getBookAdditionalInfo();
    }
  }, [bookId]);


  function replaceURL (key: string) {
    return URLCache[key]
  }

  const display = useCallback((item) => {
    const section = book?.spine.get(item);

    if (section) {
      setCurrentSection(section);

      section.load(book.load.bind(book)).then((content) => {
        if (content && content.innerHTML) {
          // @ts-ignore
          const { urls, replacementUrls } = book?.resources;
          const str = substitute(content.innerHTML, urls, replacementUrls);

          setContent(str);
        }
      });
    }

    return section;
  }, [book]);

  const [prevLabel, setPrevLabel] = useState("");
  const [nextLabel, setNextLabel] = useState("");

  function nextPage() {
    const displayed = display(currentSectionIndex + 1);
    if (displayed) setCurrentSectionIndex(currentSectionIndex + 1);
  }

  function prevPage() {
    const displayed = display(currentSectionIndex - 1);
    if (displayed) setCurrentSectionIndex(currentSectionIndex - 1);
  }

  useEffect(() => {

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

    document.addEventListener("keyup", keyListener, false);

    // const hash = window.location.hash.slice(2);

    return function () {
      document.addEventListener("keyup", keyListener, false);
    };
  }, [book]);

  // useEffect(() => {
  //   const root = document.getElementById("canvasRoot") as HTMLElement;
  //   const el = document.getElementById("canvas") as HTMLElement;

  //   markerRef.current = new Marker(root, el);
  // }, []);

  useEffect(() => {
    console.log('currentSection', currentSection);
    if (currentSection) {
      const prevSection = currentSection.prev();
      const nextSection = currentSection.next();
      
      console.log(nextSection)


      if (nextSection && nextSection.href) {
        const nextNav = book?.navigation.get(nextSection.href);
        console.log(book?.navigation)
        console.log(nextSection.href)
        console.log(nextNav)
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
      window.location.hash = "#/" + currentSection.href;
    }
  }, [currentSectionIndex, currentSection]);

  useEffect(() => {
    if (book) {
      book.opened.then(function () {
        display(currentSectionIndex);
        setCurrentSection(book.spine.get(currentSectionIndex));
      });

      console.log(book)
    }
  }, [book]);

  function handleSelectColor() {

  }

  function handleStrokeChange() {
    
  }

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
          <section className="w-full h-full py-10" id="book-section" dangerouslySetInnerHTML={{__html: content}}>
          </section>
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
