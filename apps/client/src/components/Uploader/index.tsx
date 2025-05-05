import { IconFileUpload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Tooltip } from '@mantine/core';
import { dal } from '@/dal';
import { useFileUpload } from '@/hooks/useFileUpload';

export const Uploader = () => {
  const { t } = useTranslation();
  const { isUploading, openFileDialog } = useFileUpload({
    onSuccess: (body) => {
      console.log(body);
      body.forEach(async (book) => {
        await dal.saveBookAndRelations(book.metadata);
      });
    },
  });

  return (
    <Tooltip label={t('Add new book')}>
      <ActionIcon variant="white" color="gray" size="sm" onClick={openFileDialog}>
        <IconFileUpload />
      </ActionIcon>
    </Tooltip>
  );
};
