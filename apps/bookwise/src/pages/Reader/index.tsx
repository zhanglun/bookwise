import { MouseEvent, useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import { useLocation, useParams } from "react-router-dom";
import { request } from "@/helpers/request";
import {
  BookCatalog,
  accessFileContent,
  accessImage,
  parseEpub,
  accessPageContent,
} from "@/helpers/parseEpub";
import { Catalog } from "./Catalog";
import { getAbsoluteUrl } from "@/helpers/utils";
import { useBearStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
  Highlighter,
  InfoIcon,
  MessageSquare,
  Palette,
  ScrollText,
  Share,
} from "lucide-react";
import getXPath from "@/helpers/getXPath";
import * as Selection from "@/components/SelectionPopover";
import "@/components/SelectionPopover/index.css";
import { Page } from "@/pages/Reader/Page";

const colorList = [
  "#ffd500",
  "#BFFF00",
  "#FF7F50",
  "#4B0082",
  "#008080",
  "#EE82EE",
  "#FF6F61",
  "#87CEEB",
  "#F44336",
  "#778899",
  "#00A86B",
];

export const Reader = () => {
  const location = useLocation();
  const { state } = location;
  const { id } = useParams();
  const store = useBearStore((state) => ({
    bookStack: state.bookStack,
    addBookToStack: state.addBookToStack,
  }));
  const [ bookInfo, setBookInfo ] = useState<any>({
    packaging: { metadata: {} },
    catalog: [],
  });
  const [ catalog, setCatalog ] = useState<BookCatalog[]>([]);
  const [ pageList, setPageList ] = useState<Page[]>([]);
  const [ currentHref, setCurrentHref ] = useState<string>("");
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [ currentId, setCurrentId ] = useState<string>("");
  const styleRef = useRef<HTMLStyleElement>(null);
  const [ showTooltip, setShowTooltip ] = useState(false);

  const getBookBlobs = () => {
    request
      .get(`books/${ id }/blobs`, {
        responseType: "blob",
      })
      .then((res) => {
        return parseEpub(res.data);
      })
      .then((infos) => {
        console.log("%c Line:20 🍖 infos", "color:#2eafb0", infos);
        setBookInfo(infos);
        setCatalog(infos.catalog);
      });
  };

  const getBookDetail = () => {
    request.get(`books/${ id }`).then((res) => {
      store.addBookToStack(res.data);
    });
  };

  const getBookAdditionalInfo = () => {
    request.get(`books/${ id }/additional_infos`).then((res) => {
      console.log("%c Line:65 🥐 res", "color:#33a5ff", res);
    });
  };

  useEffect(() => {
    getBookBlobs();
    getBookDetail();
    getBookAdditionalInfo();
  }, [ state ]);

  useEffect(() => {
    const loadCSS = async () => {
      const { files } = bookInfo;

      if (!files) {
        return;
      }

      let cssText = "";

      for (const [ key, file ] of Object.entries(files)) {
        if (key.split(".").pop() === "css") {
          cssText += await accessFileContent(file as any, "text/css");
          cssText += "\n";
        }
      }

      if (styleRef.current) {
        styleRef.current.innerText = cssText;
      }
    };

    loadCSS();
  }, [ bookInfo ]);

  const goToPage = (href: string, id: string) => {
    const target = document.querySelector(`[data-spinehref="${href}"]`);
    console.log("%c Line:149 🥔 target", "color:#33a5ff", target);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserClickEvent = (e: MouseEvent<HTMLElement>) => {
    let elem = null;
    const i = e.nativeEvent.composedPath();

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
      const id = elem.dataset.anchorId || "";

      if (
        href &&
        (href.indexOf("http://") >= 0 ||
          href.indexOf("https://") >= 0 ||
          href.indexOf("www.") >= 0)
      ) {
        // TODO: open in browser
        window.open(href);
      } else {
        const realHref = getAbsoluteUrl(currentHref, href);
        const anchorId = realHref.split("#")[1];

        console.log(realHref);

        goToPage(realHref, anchorId);
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
  };

  useEffect(() => {
    const generateFullContent = async () => {
      const { files, catalog, packaging } = bookInfo;
      const pages: Page[] = [];

      const loopSpine = async (list: SpineItem[]) => {
        console.log('list ===> ', list);

        for (const item of list) {
          let { href } = item;

          console.log('href ===> ', href);

          if (href.indexOf("#") >= 0) {
            href = href.split("#")[0];
          }

          if (files[href]) {
            const part = document.createElement("div");
            const body = await accessPageContent(files[href]);

            part.id = item.idref;
            part.dataset.idref = item.idref;

            if (body) {
              pages.push(
                <Page
                  key={item.idref}
                  idref={ item.idref }
                  content={ body.innerHTML }
                  bookInfo={ bookInfo }
                  href={ href }
                ></Page>
              );
            }

            // if (item.subitems) {
            //   await loopSpine(item.subitems);
            // }
          }
        }
      };

      await loopSpine(packaging.spine);

      setPageList(pages);
    };

    bookInfo && generateFullContent();
  }, [ bookInfo ]);

  const handleUserMouseUpEvent = () => {
    const selection = window.getSelection();

    if (!selection || selection?.isCollapsed) {
      setShowTooltip(false);
      return;
    }

    console.log("%c Line:263 🍐 selection", "color:#2eafb0", selection);

    const selectContent = selection.toString();
    console.log("%c Line:264 🍋 selectContent", "color:#b03734", selectContent);

    const range = selection.getRangeAt(0);
    console.log("%c Line:265 🍋 range", "color:#42b983", range);
    const { startOffset, endOffset } = range;
    console.log("%c Line:266 🥑 startOffset", "color:#e41a6a", startOffset);
    console.log("%c Line:266 🍢 endOffset", "color:#42b983", endOffset);
    // const startContainerXPath = getXPath(range.startContainer);
    // console.log(
    //   "%c Line:269 🍣 startContainerXPath",
    //   "color:#fca650",
    //   startContainerXPath
    // );
    // const endContainerXPath = getXPath(range.endContainer);
    // console.log(
    //   "%c Line:270 🍭 endContainerXPath",
    //   "color:#ed9ec7",
    //   endContainerXPath
    // );

    const startNode = range.startContainer;
    const endNode = range.endContainer;
    let startPageDiv = null;
    let endPageDiv = null;
    let startPageId = "";
    let endPageId = "";

    let currentNode = startNode;
    while (currentNode) {
      if (currentNode.dataset && "idref" in currentNode.dataset) {
        startPageDiv = currentNode;
        startPageId = currentNode.dataset.idref;
        break;
      }

      currentNode = currentNode.parentNode;
    }

    currentNode = endNode;
    while (currentNode) {
      if (currentNode.dataset && "idref" in currentNode.dataset) {
        endPageDiv = currentNode;
        endPageId = currentNode.dataset.idref;
        break;
      }

      currentNode = currentNode.parentNode;
    }

    const startElement = document.getElementById(startPageId);
    console.log("startElement", startElement);

    const endElement = document.getElementById(endPageId);
    console.log("endElement", endElement);

    function getNodeAndOffset(wrap_dom, rangeNode, start = 0) {
      const txtList = [];
      const map = function (children) {
        [ ...children ].forEach((el) => {
          if (el.nodeName === "#text") {
            txtList.push(el);
          } else {
            map(el.childNodes);
          }
        });
      };
      // 递归遍历，提取出所有 #text
      map(wrap_dom.childNodes);
      let startIdx = 0;

      console.log("txtList", txtList);

      // 计算文本的位置区间 [0,3]、[3, 8]、[8,10]
      const clips = txtList.reduce((arr, item, index) => {
        if (item === rangeNode) {
          startIdx = index;
        }

        const end =
          item.textContent.length + (arr[index - 1] ? arr[index - 1][2] : 0);
        arr.push([ item, end - item.textContent.length, end ]);
        return arr;
      }, []);

      // 查找满足条件的范围区间
      // const startNode = clips.find(el => start >= el[1] && start < el[2]);
      // const endNode = clips.find(el => end >= el[1] && end < el[2]);
      // return [startNode[0], start - startNode[1], endNode[0], end - endNode[1]]

      const startIndex = clips.reduce((acu, cur, idx) => {
        if (idx < startIdx) {
          acu = cur[1];
        } else if (idx === startIdx) {
          acu = cur[1] + start;
        }

        return acu;
      }, 0);

      return [ rangeNode, startOffset, startIndex ];
    }

    // const annotation = {
    //   start_page_id: startPageId,
    //   start_offset: startOffsetInParent,
    //   end_page_id: endPageId,
    //   end_offset: endOffsetInParent,
    //   content: selectContent,
    // }

    // console.log("annotation", annotation)
    // console.log('选中内容在页面中的 startOffset:', startOffset);
    // console.log('选中内容在页面中的 startOffsetInParent:', startOffsetInParent);
    // console.log('选中内容在页面中的 startOffsetInParent + startOffset:', startOffsetInParent + startOffset);

    setShowTooltip(true);
  };

  return (
    <div className="h-full relative pr-14">
      <div className="h-full rounded-lg bg-white/50 grid grid-flow-col grid-cols-[minmax(0,max-content),_1fr]">
        <Catalog
          className="h-full bg-white/50"
          data={ catalog }
          packaging={ bookInfo.packaging }
          onGoToPage={ async (href: string, id: string) => {
            setCurrentHref(href);
            setCurrentId(id);

            await goToPage(href, id);
          } }
        />
        <div
          className="h-full overflow-hidden rounded-e-lg bg-white/100 shadow-sm"
          id="boundaryRef"
        >
          <div id="box" className="h-full overflow-hidden">
            <div className="h-full overflow-y-scroll flex flex-row">
              <div
                className="flex-1 max-w-4xl m-auto leading-relaxed"
                onClick={ handleUserClickEvent }
                // onMouseUp={ handleUserMouseUpEvent }
                id="popover-container"
              >
                <style type="text/css" ref={ styleRef }/>
                <section className="book-section" id="book-section">
                  {pageList.map((page) => page)}
                </section>
              </div>
              <Selection.Root>
                <Selection.Trigger>
                  {/*<div*/ }
                  {/*  className="flex-1 max-w-4xl px-4 sm:px-4 py-10 m-auto leading-relaxed"*/ }
                  {/*  onClick={ handleUserClickEvent }*/ }
                  {/*  onMouseUp={ handleUserMouseUpEvent }*/ }
                  {/*  id="popover-container"*/ }
                  {/*>*/ }
                  {/*  <style type="text/css" ref={ styleRef }/>*/ }
                  {/*  <section*/ }
                  {/*    className="book-section"*/ }
                  {/*    dangerouslySetInnerHTML={ { __html: fullContent } }*/ }
                  {/*  ></section>*/ }
                  {/*</div>*/ }
                </Selection.Trigger>
                <Selection.Portal
                  container={ document.getElementById("popover-container") }
                >
                  <Selection.Content
                    className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    collisionBoundary={ document.getElementById("boundaryRef") }
                    avoidCollisions={ false }
                    hideWhenDetached={ true }
                  >
                    <div className="px-2 py-1">
                      <div>
                        <Button size="icon" variant="ghost">
                          <Highlighter size={ 14 }/>
                        </Button>
                        <Button size="icon" variant="ghost">
                          <MessageSquare size={ 14 }/>
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Share size={ 14 }/>
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        { colorList.map((color) => {
                          return (
                            <span
                              className="w-5 h-5 rounded-full"
                              key={ color }
                              style={ { backgroundColor: color } }
                            ></span>
                          );
                        }) }
                      </div>
                    </div>
                  </Selection.Content>
                </Selection.Portal>
              </Selection.Root>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 bg-white rounded-lg">
          <div className="p-1 flex flex-wrap flex-col">
            <Button size="icon" variant="ghost">
              <Palette size={ 16 }/>
            </Button>
            <Button size="icon" variant="ghost">
              <ScrollText size={ 16 }/>
            </Button>
            <Button size="icon" variant="ghost">
              <InfoIcon size={ 16 }/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
