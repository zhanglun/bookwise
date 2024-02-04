import {useParams} from "react-router-dom";
import {EpubViewer} from "@/views/Viewer/epub.tsx";

export const Viewer = () => {
  const {uuid} = useParams();
  return <div>
    {uuid && <EpubViewer uuid={uuid}/>}
  </div>
}
