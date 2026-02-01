import { IconFileUpload, IconLoader } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Tooltip } from '@mantine/core';
import { toast } from 'sonner';
import { dal } from '@/dal';
import { useFileUpload } from '@/hooks/use-file-upload';

interface UploaderProps {
  onUploadComplete?: () => void;
}

export const Uploader = ({ onUploadComplete }: UploaderProps) => {
  const { t } = useTranslation();
  const { isUploading, openFileDialog } = useFileUpload({
    onSuccess: async (body) => {
      const total = body.length;
      let successCount = 0;

      toast.promise(
        (async () => {
          for (const book of body) {
            if (book.buffer) {
              const buffer = book.buffer as Uint8Array;
              const cover = book.cover as Uint8Array | null;

              await dal.saveBookAndRelations(book.metadata, buffer, cover);
              successCount++;
            }
          }

          onUploadComplete?.();
        })(),
        {
          loading: `正在上传 ${total} 本书籍...`,
          success: `${total} 本书籍上传成功`,
          error: '上传失败，请重试',
        }
      );
    },
  });

  return (
    <Tooltip label={t('Add new book')}>
      <ActionIcon
        variant="white"
        color="gray"
        size="sm"
        onClick={isUploading ? undefined : openFileDialog}
        loading={isUploading}
      >
        {isUploading ? <IconLoader size={16} /> : <IconFileUpload />}
      </ActionIcon>
    </Tooltip>
  );
};
