import { useParams } from "react-router-dom";
import { EpubViewer } from "@/views/Viewer/Epub";

export const Viewer = () => {
  const { uuid } = useParams();
  return (
    <div className="text-foreground bg-app w-full h-full">
      {uuid && <EpubViewer bookId={uuid} />}
    </div>
  );
};
