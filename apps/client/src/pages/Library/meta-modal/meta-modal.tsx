import { FC } from 'react';
import { format } from 'date-fns';
import { Group, Modal, Stack, Text } from '@mantine/core';
import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';

export interface MetaModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  data?: BookResItem;
}

export const MetaModal: FC<MetaModalProps> = ({ isOpen, setIsOpen, data }) => {
  const renderContent = () => {
    return (
      <div>
        <Stack gap="md">
          {data.cover && (
            <div style={{ width: '50%' }}>
              <Cover book={data} />
            </div>
          )}
          <Group gap="xs">
            <Text fw={500} size="sm" w={100}>
              标题
            </Text>
            <Text size="sm">{data.title}</Text>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm" w={100}>
              作者
            </Text>
            <Text size="sm">{data.authors.map((author) => author.name).join(', ')}</Text>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm" w={100}>
              出版社
            </Text>
            <Text size="sm">{data.publishers.map((publisher) => publisher.name).join(', ')}</Text>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm" w={100}>
              ISBN
            </Text>
            <Text size="sm">{data.isbn}</Text>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm" w={100}>
              语言
            </Text>
            <Text size="sm">{data.language_id}</Text>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm" w={100}>
              格式
            </Text>
            <Text size="sm">{data.format}</Text>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm" w={100}>
              页数
            </Text>
            <Text size="sm">{data.page_size}</Text>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm" w={100}>
              出版日期
            </Text>
            <Text size="sm">{format(new Date(data.publish_at), 'yyyy-MM-dd')}</Text>
          </Group>
          <Group gap="xs" align="flex-start">
            <Text fw={500} size="sm" w={100}>
              描述
            </Text>
            <Text size="sm">{data.description}</Text>
          </Group>
        </Stack>
      </div>
    );
  };
  return (
    <Modal opened={isOpen} onClose={setIsOpen} centered fullScreen>
      {renderContent()}
    </Modal>
  );
};
