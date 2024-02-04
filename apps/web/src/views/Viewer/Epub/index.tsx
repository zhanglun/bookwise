import Book from "epubjs";
import {request} from "@/helpers/request.ts";
import {useEffect, useState} from "react";
import {EpubObject, parseEpub} from "@/helpers/epub";
import {Toc} from "@/layout/Toc";

export interface EpubViewerProps {
  uuid: string;
}

export const EpubViewer = ({uuid}: EpubViewerProps) => {
  const [instance, setInstance] = useState<EpubObject>({} as EpubObject)
  const [files, setFiles] = useState([]);

  function getEpubBlobs() {
    request.get(`books/${uuid}/blobs`, {
      responseType: 'blob',
    }).then((res) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const instance = new Book(res.data);
      console.log("instance", instance);
      console.log(instance.navigation)
      return parseEpub(res.data);
    }).then((res) => {
      console.log(res);
      setInstance(res);
    });
  }

  const getBookAdditionalInfo = () => {
    request.get(`books/${uuid}/additional_infos`).then((res) => {
      console.log("%c Line:65 🥐 res", "color:#33a5ff", res);
    });
  };



  useEffect(() => {
    getEpubBlobs();
    getBookAdditionalInfo();
  }, [uuid]);

  return <div>
    <Toc navigation={instance?.navigation} metadata={instance?.metadata} onItemClick={() => {}} />
  </div>
}
