import { request } from "@/helpers/request";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parseEpub } from "@/helpers/parseEpub";
import { Catalog } from "./Catalog";

export const Reader = () => {
  const location = useLocation();
  const { state } = location;
  const [bookInfo, setBookInfo] = useState<any>({});
  const [catalog, setCatalog] = useState<any[]>([]);

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

  return (
    <div>
      Reader {state.book_id}
      <Catalog data={catalog} />
    </div>
  );
};
