import { useParams } from "react-router-dom";
import { EpubViewer } from "@/views/Viewer/Epub";
import { ViewerLayout } from "./Layout";

export const Viewer = () => {
  const { uuid } = useParams();

  // return <>{uuid && <EpubViewer bookUuid={uuid} />}</>;
  return <ViewerLayout bookUuid={uuid} />;
};
