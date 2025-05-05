import { IconFileUpload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Tooltip } from '@mantine/core';
import { dal } from '@/dal';
import { useFileUpload } from '@/hooks/useFileUpload';

export const Uploader = () => {
  const { t } = useTranslation();
  const { openFileDialog } = useFileUpload({
    onSuccess: (body) => {
      body.forEach(async (book) => {
        const res = await dal.saveBookAndRelations(book.metadata);
        console.log('🚀 ~ body.forEach ~ res:', res);
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
