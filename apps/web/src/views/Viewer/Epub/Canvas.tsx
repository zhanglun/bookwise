import { useEffect, useRef, useState } from "react";
import {
  Highlighter,
  InfoIcon,
  MessageSquare,
  Palette,
  ScrollText,
  Share,
} from "lucide-react";
import * as Selection from "@/components/SelectionPopover";
import "@/components/SelectionPopover/index.css";
import { Button } from "@radix-ui/themes";
import { accessImage } from "@/helpers/epub";
import { getAbsoluteUrl } from "@/helpers/book";

export interface PageProps {
  idref: string;
  children?: any;
  content: string;
  bookInfo: any;
  href: string;
  url: string;
}

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

export function PageCanvas(props: PageProps) {
  const { idref, content, bookInfo, href, url } = props;
  const DOMNodeRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const convertImages = async (
    files: any,
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

    init().then((res) => {
      const width = DOMNodeRef.current?.offsetWidth;
      const height = DOMNodeRef.current?.offsetHeight;

      setSize({ width, height });

      // if (DOMNodeRef.current) {
      //   const markers = new Marker(DOMNodeRef.current);
      //   DOMNodeRef.current.addEventListener("mouseup", () => {
      //     const config = {
      //       rectFill: "red",
      //       lineStroke: "green",
      //       strokeWidth: 2,
      //     };
      //     const mark = markers.getSelectionRange(null, config);
      //     console.log("%c Line:89 🍬 mark", "color:#ffdd4d", mark);
      //     if (mark) markers.addMark(mark);

      //     console.log(markers.marks);
      //   });
      // }
    });
  }, [content]);

  return (
    <div
      id={idref}
      data-spine-idref={idref}
      data-spine-href={href}
      data-spine-url={url}
      key={idref}
      className="min-h-[100vh] my-5 shadow-md relative"
    >
      <Selection.Root>
        <Selection.Trigger>
          <div className={"px-10 py-12 w-full min-h-full"} ref={DOMNodeRef}>
            <div id={`${idref}-box`}></div>
          </div>
        </Selection.Trigger>
        <Selection.Portal>
          <Selection.Content
            className="rounded-md border bg-popover bg-white p-1 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            collisionBoundary={document.getElementById("boundaryRef")}
            avoidCollisions={false}
            hideWhenDetached={true}
          >
            <div className="px-2 py-1">
              <div>
                <Button size="1" variant="ghost">
                  <Highlighter size={14} />
                </Button>
                <Button size="2" variant="ghost">
                  <MessageSquare size={14} />
                </Button>
                <Button size="3" variant="ghost">
                  <Share size={14} />
                </Button>
              </div>
              <div className="flex gap-2">
                {colorList.map((color) => {
                  return (
                    <span
                      className="w-5 h-5 rounded-full"
                      key={color}
                      style={{ backgroundColor: color }}
                    ></span>
                  );
                })}
              </div>
            </div>
          </Selection.Content>
        </Selection.Portal>
      </Selection.Root>
    </div>
  );
}
