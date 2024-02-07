import Book from "epubjs";
import { request } from "@/helpers/request.ts";
import { useEffect, useState } from "react";
import { accessPageContent, EpubObject, parseEpub, SpineItem } from "@/helpers/epub";
import { Toc } from "@/views/Viewer/Epub/Toc.tsx";
import { PageCanvas } from "@/views/Viewer/Epub/Canvas.tsx";

export interface EpubViewerProps {
  uuid: string;
}

export const EpubViewer = ({ uuid }: EpubViewerProps) => {
  const [ instance, setInstance ] = useState<EpubObject>({} as EpubObject)
  const [ pageList, setPageList ] = useState<typeof PageCanvas[]>([]);

  function getEpubBlobs() {
    request.get(`books/${ uuid }/blobs`, {
      responseType: 'blob',
    }).then((res) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const instance = new Book(res.data);
      console.log("instance", instance);
      console.log(instance.navigation)
      return parseEpub(res.data);
    }).then((res) => {
      setInstance(res);
    });
  }

  const getBookAdditionalInfo = () => {
    request.get(`books/${ uuid }/additional_infos`).then((res) => {
      console.log("%c Line:65 🥐 res", "color:#33a5ff", res);
    });
  };

  useEffect(() => {
    getEpubBlobs();
    getBookAdditionalInfo();
  }, [ uuid ]);

  useEffect(() => {
    const generateFullContent = async () => {
      const { files } = instance;
      const pages: any[] = [];

      const loopSpine = async (list: SpineItem[]) => {
        for (const item of list) {
          console.log(item);
          let { href, url } = item;

          if (href.indexOf("#") >= 0) {
            href = href.split("#")[0];
          }

          console.log("href", href)
          console.log("url", url)

          if (files[url]) {
            const part = document.createElement("div");
            const body = await accessPageContent(files[url]);

            part.id = item.idref;
            part.dataset.idref = item.idref;

            if (body) {
              pages.push(
                <PageCanvas
                  key={ item.idref }
                  idref={ item.idref }
                  content={ body.innerHTML }
                  bookInfo={ instance }
                  href={ href }
                  url={ url }
                ></PageCanvas>
              );
            }
          }
        }

      };

      await loopSpine(instance.spine);

      setPageList(pages);
    };

    instance.spine && instance.spine.length > 0 && generateFullContent();
  }, [ instance ]);

  return <div className={ "grid grid-cols-[auto_1fr]" }>
    <div className={ " fixed top-0 left-0 bottom-0" }>
      <Toc navigation={ instance?.navigation } metadata={ instance?.metadata } onItemClick={ () => {
      } }/>
    </div>
    <section className="" id="book-section">
      { pageList.map((page) => page) }
    </section>
  </div>
}
