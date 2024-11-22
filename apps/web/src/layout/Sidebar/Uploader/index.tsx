import { FilePlusIcon } from "@radix-ui/react-icons";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { BookResItem } from "@/interface/book";
import { useEffect } from "react";
import { IpcRendererEvent } from "electron";
import { useFileUpload } from "@/hooks/useFileUpload";
import { dal } from "@/dal";
import { toast } from "sonner";

export interface UploaderProps {
  onSuccess: (book: BookResItem) => void;
}

export const Uploader = (props: UploaderProps) => {
  const { isUploading, openFileDialog } = useFileUpload({
    acceptTypes: [".epub", ".pdf"],
  });

  useEffect(() => {
    window.electronAPI.onUploadFileSuccess(
      async (_e: IpcRendererEvent, body) => {
        const { model } = body;
        toast.promise(dal.saveBookAndRelations(model), {
          loading: `Uploading ${model.title}`,
          success: (data) => {
            props.onSuccess(data);
            return `${model.title} uploaded successfully`;
          },
          error: (error) => {
            return `Upload failed: ${error?.message}`;
          },
        });
      }
    );
  }, [props]);

  return (
    <Tooltip content="Add new book">
      <IconButton
        variant="ghost"
        className="cursor-pointer"
        disabled={isUploading}
        onClick={openFileDialog}
      >
        <FilePlusIcon width={18} height={18} />
      </IconButton>
    </Tooltip>
  );
};
