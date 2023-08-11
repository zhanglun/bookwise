import { request } from "@/helpers/request";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BookCatalog, accessFileContent, parseEpub } from "@/helpers/parseEpub";
import { Catalog } from "./Catalog";

export const Reader = () => {
  const location = useLocation();
  const { state } = location;
  const [bookInfo, setBookInfo] = useState<any>({});
  const [catalog, setCatalog] = useState<BookCatalog[]>([]);
  const [content, setContent] = useState<string>("");

  const getBookDetail = () => {
    request
      .get(`books/${state.book_id}/blobs`, {
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

  useEffect(() => {
    getBookDetail();
  }, []);

  console.log("%c Line:4 🍭 location", "color:#b03734", location);

  const goToPage = useCallback(
    async (id: string, href: string) => {
      console.log("%c Line:35 🥥 id", "color:#e41a6a", id, href);
      const { files } = bookInfo;
      console.log("%c Line:37 🥐 files", "color:#2eafb0", files[href]);

      if (files[href]) {
        const xml = await accessFileContent(files[href]);
        const parser = new DOMParser();
        const content = parser.parseFromString(xml, "application/xhtml+xml");
        console.log("%c Line:44 🍏 content", "color:#4fff4B", content);

        setContent(content.querySelector("body")?.innerHTML || '');
      }
    },
    [bookInfo]
  );

  return (
    <div>
      <Catalog data={catalog} onGoToPage={goToPage} />
      <div>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  );
};
