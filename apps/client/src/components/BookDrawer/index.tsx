import { format } from 'date-fns';
import { Drawer, Group, Image, Stack, Text } from '@mantine/core';
import { BookResItem } from '@/interface/book';
import { Cover } from '../Book/Cover';

interface BookDrawerProps {
  opened: boolean;
  onClose: () => void;
  data?: BookResItem;
}

export const BookDrawer = (props: BookDrawerProps) => {
  const { opened, onClose, data } = props;

  if (!data) {
    return null;
  }

  return (
    <Drawer opened={opened} onClose={onClose} position="right" size="md" title="图书详情">
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
    </Drawer>
  );
};
