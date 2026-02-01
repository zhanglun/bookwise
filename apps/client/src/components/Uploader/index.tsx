import { IconFileUpload, IconLoader } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useFileUploadWithDedup } from '@/hooks/use-file-upload-dedup';
import classes from './uploader.module.css';

interface UploaderProps {
  onUploadComplete?: () => void;
}

export const Uploader = ({ onUploadComplete }: UploaderProps) => {
  const { t } = useTranslation();
  const { isUploading, progress, currentBookName, openFileDialog } = useFileUploadWithDedup({
    onSuccess: () => {
      onUploadComplete?.();
    },
  });

  const progressPercent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <>
      {isUploading && (
        <div className={classes.progressBarContainer}>
          <div className={classes.progressBarHeader}>
            <span className={classes.progressBarTitle}>正在上传书籍...</span>
            <span className={classes.progressBarCount}>
              {progress.current} / {progress.total}
            </span>
          </div>
          <div className={classes.progressBar}>
            <div 
              className={classes.progressBarFill} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {currentBookName && (
            <div className={classes.currentBook}>
              当前: {currentBookName}
            </div>
          )}
        </div>
      )}
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
    </>
  );
};
