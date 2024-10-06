import { useParams } from "react-router-dom";
import { EpubViewer } from "@/views/Viewer/Epub";

export const Viewer = () => {
  const { uuid } = useParams();

  return <>{uuid && <EpubViewer bookUuid={uuid} />}</>;
};
