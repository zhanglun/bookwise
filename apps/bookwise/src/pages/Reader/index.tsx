import { request } from "@/helpers/request";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { parseEpub } from "@/helpers/parseEpub";

export const Reader = () => {
  const location = useLocation();
  const { state } = location;

  const getBookDetail = () => {
    request.get(`books/${state.book_id}/blobs`, {
      responseType: 'blob'
    }).then((res) => {
      parseEpub(res.data);
    });
  };

  useEffect(() => {
    getBookDetail();
  }, []);

  console.log("%c Line:4 🍭 location", "color:#b03734", location);

  return <div>Reader {state.book_id}</div>;
};
