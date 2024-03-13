import { useParams } from "react-router-dom";
import { EpubViewer } from "@/views/Viewer/Epub";

export const Viewer = () => {
  const { uuid } = useParams();
  return <div>{uuid && <EpubViewer bookId={uuid} />}</div>;
};
