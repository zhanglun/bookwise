import { format } from 'date-fns';
import { Group, Text, Title } from '@mantine/core';
import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';
import classes from './info-panel.module.css';

export type InfoPanelType = {
  data?: BookResItem;
};

export const InfoPanel = (props: InfoPanelType) => {
  const { data } = props;
  const { cover } = data || {};

  console.log('🚀 ~ InfoPanel ~ data:', data);

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Please select item to view
      </div>
    );
  }

  return (
    <div className={classes.infoPanel}>
      <div className={classes.infoPanelCover}>
        <Cover book={data} cover={cover} />
      </div>
      <div className={classes.infoPanelContent}>
        <Title order={3}>{data.title}</Title>
        <Group gap="xs">
          <Text fw={500} size="sm" c="gray">
            作者
          </Text>
          <Text size="sm">{data.authors.map((author) => author.name).join(', ')}</Text>
        </Group>
        <Group gap="xs">
          <Text fw={500} size="sm">
            出版社
          </Text>
          <Text size="sm">{data.publishers.map((publisher) => publisher.name).join(', ')}</Text>
        </Group>
        <Group gap="xs">
          <Text fw={500} size="sm">
            ISBN
          </Text>
          <Text size="sm">{data.isbn}</Text>
        </Group>
        <Group gap="xs">
          <Text fw={500} size="sm">
            语言
          </Text>
          <Text size="sm">{data.language_id}</Text>
        </Group>
        <Group gap="xs">
          <Text fw={500} size="sm">
            格式
          </Text>
          <Text size="sm">{data.format}</Text>
        </Group>
        <Group gap="xs">
          <Text fw={500} size="sm">
            页数
          </Text>
          <Text size="sm">{data.page_size}</Text>
        </Group>
        <Group gap="xs">
          <Text fw={500} size="sm">
            出版日期
          </Text>
          <Text size="sm">{format(new Date(data.publish_at), 'yyyy-MM-dd')}</Text>
        </Group>
        <Group gap="xs" align="flex-start">
          <Text fw={500} size="sm">
            描述
          </Text>
          <Text size="sm">{data.description}</Text>
        </Group>
      </div>
      {/* {data && <RichMeta defaultData={data} />} */}
    </div>
  );
};
