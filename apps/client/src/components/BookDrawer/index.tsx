import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Grid, Group, Stack, Text } from '@mantine/core';
import { BookResItem } from '@/interface/book';
import { Cover } from '../Book/Cover';
import classes from './bookDrawer.module.css';

interface BookDrawerProps {
  opened: boolean;
  onClose: () => void;
  data?: BookResItem;
  children?: React.ReactNode;
}

export const BookDrawer = (props: BookDrawerProps) => {
  const { opened, onClose, data, children } = props;
  const [collapsed, setCollapsed] = useState(!opened);

  useEffect(() => {
    setCollapsed(!opened);
  }, [opened]);

  if (!data) {
    return children;
  }

  return (
    <Grid.Col span={collapsed ? 0 : 3} className={classes.drawer} p="md">
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
    </Grid.Col>
  );
};
