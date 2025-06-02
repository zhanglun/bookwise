import { format } from 'date-fns';
import { Group, Text } from '@mantine/core';
import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';

export type InfoPanelType = {
  data?: BookResItem;
};

export const InfoPanel = (props: InfoPanelType) => {
  const { data } = props;

  console.log('🚀 ~ InfoPanel ~ data:', data);

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Please select item to view
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <Cover book={data} />
        </div>
        <div>
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
        </div>
        {/* {data && <RichMeta defaultData={data} />} */}
      </div>
    </div>
  );
};
