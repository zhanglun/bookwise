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
import CanvasHighlighter from "@/pages/Reader/Canvas";

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

  const convertImages = async (
    files: any,
    currentHref: string,
    images: NodeListOf<Element>
  ) => {
    for (const image of images) {
      let attr = "src";
      let href: string = image.getAttribute("src") || "";

      if (!href) {
        href =
          image.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "";
        attr = "href";
      }

      if (!href) {
        href = image.getAttribute("xlink:href") || "";
        attr = "xlink:href";
      }

      href = getAbsoluteUrl(currentHref, href);
      const name = href;

      if (files[name]) {
        const imageBlob = await accessImage(files[name]);

        // 创建 FileReader 对象读取 Blob 数据
        const reader = new FileReader();
        reader.onload = (function (img) {
          return function (event) {
            const dataURL = event?.target?.result;

            img.setAttribute(attr, (dataURL || "") as string);
          };
        })(image);

        reader.readAsDataURL(imageBlob);
      }
    }
  };

  const goToPage = (href: string, id: string) => {
    const target = document.getElementById(id);
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
      const { files, catalog } = bookInfo;
      const pages: Page[] = [];

      const loopCatalog = async (list: BookCatalog[]) => {
        for (const item of list) {
          let { href } = item;

          if (href.indexOf("#") >= 0) {
            href = href.split("#")[0];
          }

          if (files[href]) {
            const part = document.createElement("div");
            const body = await accessPageContent(files[href]);

            part.id = item.ncxId;
            part.dataset.ncxId = item.ncxId;

            if (body) {
              pages.push(
                <Page
                  ncxId={ item.ncxId }
                  content={ body.innerHTML }
                  bookInfo={ bookInfo }
                  ncxHref={ href }
                ></Page>
              );
            }

            if (item.subitems) {
              await loopCatalog(item.subitems);
            }
          }
        }
      };

      await loopCatalog(catalog);

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
      if (currentNode.dataset && "ncxId" in currentNode.dataset) {
        startPageDiv = currentNode;
        startPageId = currentNode.dataset.ncxId;
        break;
      }

      currentNode = currentNode.parentNode;
    }

    currentNode = endNode;
    while (currentNode) {
      if (currentNode.dataset && "ncxId" in currentNode.dataset) {
        endPageDiv = currentNode;
        endPageId = currentNode.dataset.ncxId;
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

  useEffect(() => {
    // container 为页面需要划词高亮区域的 DOM 对象
    // const container = document.getElementById("boundaryRef");
    const container = document.getElementById("book-section");

    setTimeout(() => {
      const highlighter = new CanvasHighlighter(container);
      container.addEventListener("mouseup", () => {
        const range = highlighter.getSelectionRange();
        console.log(range);
        if (range) highlighter.addRange(range);
      },);
    }, 6000)

  }, []);

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
          className="h-full overflow-hidden py-8 rounded-e-lg bg-white/100 shadow-sm"
          id="boundaryRef"
        >
          <div id="box" className="h-full overflow-hidden">
            <div className="px-4 h-full overflow-y-scroll flex flex-row">
              <div
                className="flex-1 max-w-4xl px-4 sm:px-4 py-10 m-auto leading-relaxed"
                onClick={ handleUserClickEvent }
                // onMouseUp={ handleUserMouseUpEvent }
                id="popover-container"
              >
                <style type="text/css" ref={ styleRef }/>
                <section className="book-section" id="book-section">
                  {/*{pageList.map((page) => page)}*/}

                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquam, autem cumque debitis
                    deserunt dolore doloremque dolores fugiat id illum iure necessitatibus nemo nisi porro quia rem sit
                    sunt voluptatibus!</p><p>Culpa dolorem eligendi eos eum hic, id illum laborum magnam nisi odio porro
                  praesentium, repellendus sit, tempore totam vel voluptates! Esse ex magni, molestiae optio quam quia
                  quisquam saepe sequi!</p><p>Aliquam, animi commodi corporis doloremque eius exercitationem, hic illo
                  molestiae qui quos ut vel voluptatibus. Assumenda commodi eum ex excepturi facere ipsam iusto quas
                  ratione ut voluptate? Asperiores, cupiditate, eaque?</p><p>Asperiores atque, blanditiis ipsa molestiae
                  molestias provident qui quia rem. Amet atque enim illum incidunt nesciunt nobis odio tenetur
                  voluptate! Ab, commodi debitis eligendi pariatur quo sequi tenetur voluptas voluptatem.</p><p>Ab ad
                  atque dolorem, doloremque dolorum ea excepturi expedita illum laudantium perspiciatis quaerat quam
                  repellat sit totam voluptatum. Consequuntur dicta enim et eum fugit maiores molestiae odio veniam!
                  Cum, pariatur!</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos nisi officia quibusdam vero.
                    Autem consequuntur ea fugit illum iste iure molestias nostrum perspiciatis quos repellendus sit vel
                    vitae, voluptates voluptatum?</p><p>A at dicta impedit nam necessitatibus? Ab accusamus ad aut
                  ducimus eaque, facilis in, incidunt maxime necessitatibus nesciunt nihil non officia recusandae
                  reiciendis reprehenderit rerum voluptate, voluptatum? Dolorum, non, suscipit?</p><p>Culpa non
                  reiciendis velit. Cupiditate deleniti explicabo facilis, fuga harum itaque suscipit temporibus
                  voluptatem. Asperiores blanditiis dolorum ea eveniet excepturi facilis, in natus perspiciatis quis
                  sunt? Amet commodi esse ipsum.</p><p>Accusamus accusantium aliquid animi assumenda, commodi culpa
                  doloremque dolores eum expedita itaque iusto neque nesciunt nihil nobis non, nulla quas quia quidem
                  quisquam recusandae repudiandae saepe sapiente sint ullam vel!</p><p>Adipisci animi at aut consectetur
                  consequuntur cum cupiditate debitis dignissimos ea, earum eius est explicabo impedit in, ipsum libero
                  magnam molestias nesciunt pariatur praesentium quam repellat sapiente sed vel voluptas!</p><p>Alias
                  deleniti explicabo officiis perspiciatis praesentium repellat sint sunt? Assumenda dolor dolorum esse
                  ipsa iusto magni minus, nemo neque nisi non nostrum pariatur praesentium provident repellat
                  repellendus sequi sint veritatis?</p><p>A ea fuga laudantium perspiciatis ratione! Ab, accusamus alias
                  aliquid architecto beatae cupiditate expedita impedit itaque labore minus numquam praesentium, quasi
                  qui quidem quisquam repudiandae sequi similique vel veritatis vitae?</p><p>Accusantium amet,
                  consequatur cum fuga laboriosam laborum nobis numquam optio placeat qui quis saepe ullam unde, vero
                  voluptatum. Blanditiis doloremque explicabo fugit non omnis quo rerum tenetur velit vitae
                  voluptatem?</p><p>Ad, adipisci animi beatae debitis deserunt eaque nemo numquam unde. Atque est fugiat
                  labore, nostrum numquam sunt velit. Architecto, assumenda atque laborum magnam maiores odio
                  perspiciatis quas quo similique totam.</p><p>Architecto aut doloribus dolorum eaque eos exercitationem
                  fugiat inventore laboriosam magnam nobis numquam, officiis, pariatur qui reprehenderit similique, sint
                  vitae! Ab dignissimos dolorem magnam neque nisi placeat praesentium repellendus reprehenderit.</p><p>A
                  accusamus aliquam aperiam cupiditate deleniti deserunt dicta earum eveniet excepturi fugit id maiores
                  nemo nesciunt obcaecati pariatur, sequi unde vel velit? Blanditiis iste magni quas quis, sequi sit
                  totam?</p><p>A ad adipisci amet aperiam architecto corporis cupiditate, deserunt dignissimos
                  doloremque ducimus eveniet in ipsam iusto maiores, nam nesciunt nostrum nulla officiis quam recusandae
                  reprehenderit rerum sunt tenetur vel voluptatem.</p><p>Alias aliquam assumenda at atque beatae commodi
                  consequuntur eaque ex expedita, facilis incidunt modi, nulla officia omnis placeat quasi qui quidem
                  ratione reiciendis soluta sunt suscipit vel veniam? Amet, consectetur?</p><p>Aliquam commodi, cumque
                  dignissimos dolorum eaque enim esse ex expedita fugit hic incidunt ipsam nulla officiis quos soluta
                  totam vero! Corporis debitis dolorem dolores esse, iure quis temporibus vel voluptas!</p><p>Ab
                  accusantium animi consequuntur cum cupiditate dolor eligendi ex fugiat fugit id in iusto laboriosam
                  laborum minus nemo nobis optio quam, qui quisquam repellat sed similique sint sit velit veniam!</p>
                  <p>Assumenda aut culpa dolores exercitationem laborum nihil nulla officia pariatur quibusdam ratione,
                    repellendus voluptas voluptate. Architecto delectus illum nam nemo nobis officia possimus quaerat
                    quidem, voluptate voluptatum! Ea eaque, est?</p><p>Accusamus cumque deleniti minus molestiae
                  pariatur quod, similique tempora tempore tenetur voluptate! Aliquid amet aspernatur, cum dicta
                  dignissimos distinctio dolor, eligendi esse inventore ipsam molestias officiis porro sed suscipit
                  voluptates.</p><p>Accusamus consequatur earum est eum excepturi, fuga harum inventore iste maiores
                  maxime necessitatibus praesentium quis repellat temporibus unde voluptates voluptatum. Amet asperiores
                  dolor error et libero nostrum quas sunt ut.</p><p>A ab accusamus aliquid, assumenda aut autem
                  consectetur consequuntur culpa distinctio ducimus error inventore, ipsam ipsum magni mollitia nesciunt
                  non optio placeat quam quibusdam sequi unde vitae? Dolorem est, excepturi.</p><p>Assumenda cumque
                  debitis dolor earum exercitationem inventore iusto magnam maxime molestiae nam nemo nostrum officia
                  porro, praesentium, provident quod reprehenderit rerum. Consequuntur id impedit, magnam mollitia quas
                  quo rerum totam?</p><p>Ab, accusamus architecto at commodi cumque cupiditate dolor doloribus ea, id
                  ipsam itaque labore magni, necessitatibus numquam odio optio quidem quis similique sit velit?
                  Aspernatur blanditiis laborum modi numquam veniam.</p><p>Assumenda excepturi iure obcaecati voluptate?
                  Aliquam, architecto assumenda at consectetur consequatur distinctio ea esse expedita nemo odio quaerat
                  quo recusandae sequi, tempora, vitae. Amet architecto et, laboriosam molestias optio voluptatum!</p>
                  <p>Corporis earum est magni numquam officiis quia soluta tempore vitae. Consectetur distinctio ipsum
                    modi numquam ratione sint temporibus. Accusantium aperiam culpa exercitationem labore molestias odio
                    quos ratione, sit tempore voluptatem.</p><p>Alias culpa doloremque ea maxime perspiciatis saepe
                  vero. Amet autem debitis earum facilis harum hic illum ipsa ipsum laudantium maiores mollitia nisi,
                  sed suscipit. Aut debitis deserunt ex quos voluptate!</p><p>Alias asperiores corporis dolor, et,
                  incidunt laborum maxime nam nesciunt nisi officia pariatur sequi velit voluptatum. Cupiditate deserunt
                  eaque, eius eligendi est exercitationem fugit itaque molestiae reprehenderit saepe sit, tempora?</p>
                  <p>Blanditiis ducimus impedit porro quaerat rerum tempore? Aperiam asperiores aspernatur aut beatae
                    blanditiis culpa dicta, eos fugit in iusto nemo optio quis quisquam quod ratione rerum saepe
                    sapiente, vitae voluptatem!</p><p>Blanditiis commodi, corporis delectus deleniti ea fuga hic labore
                  libero nesciunt odit quod sunt suscipit. At, culpa, eos excepturi fugiat iste libero necessitatibus
                  nemo nihil, omnis qui quo ratione sed?</p><p>A ab adipisci alias asperiores cupiditate doloribus ea
                  eaque eius ex exercitationem facilis fugit illum laborum laudantium nemo nulla porro, quibusdam quo
                  quod repellendus repudiandae temporibus ut! Aut consequuntur, ea!</p><p>Alias amet beatae culpa
                  deleniti ea eius, enim iure nesciunt obcaecati odio perspiciatis possimus quaerat quas quasi quis
                  ratione repellat sapiente sint soluta, sunt, unde voluptate voluptatibus! Cumque, fugiat natus?</p>
                  <p>Accusantium alias assumenda at aut beatae blanditiis debitis deleniti, eius eos esse eum eveniet in
                    ipsum laboriosam laudantium libero minus molestias neque, nobis optio quae quam quod sapiente, velit
                    vero!</p>
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
