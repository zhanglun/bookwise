import { request } from "@/helpers/request";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import JSZip from 'jszip';

console.log("%c Line:5 🍑 JSZip", "color:#b03734", JSZip);

export const Reader = () => {
  const location = useLocation();
  const { state } = location;

  const getBookDetail = () => {
    request.get(`books/${state.book_id}/blobs`, {
      responseType: 'blob'
    }).then((res) => {
      const zip = new JSZip();
      const { data } = res;
      
      zip.loadAsync(data).then((result) => {
        console.log("%c Line:17 🍊 result", "color:#93c0a4", result);
      })
    });
  };

  useEffect(() => {
    getBookDetail();
  }, []);

  console.log("%c Line:4 🍭 location", "color:#b03734", location);

  return <div>Reader {state.book_id}</div>;
};
