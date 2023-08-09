import { request } from "@/helpers/request";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import JSZip from 'jszip';
import { parseEpub } from "@/helpers/parseEpub";

console.log("%c Line:5 🍑 JSZip", "color:#b03734", JSZip);

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
