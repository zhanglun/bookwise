import { FC } from 'react';
import { Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';
import { AuthorSelect } from './components/author-select';
import { PublisherSelect } from './components/publisher-select';
import classes from './meta-modal.module.css';

export interface MetaModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  data?: BookResItem;
}

export const MetaModal: FC<MetaModalProps> = ({ isOpen, setIsOpen, data }) => {
  const handleSubmit = () => {};

  const renderContent = () => {
    return (
      <div className={classes.content}>
        {data.cover && (
          <div style={{ width: '30%' }}>
            <Cover book={data} />
          </div>
        )}
        <div className={classes.metaList}>
          <Stack>
            <form onSubmit={handleSubmit} className={classes.form}>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  标题
                </Text>
                <TextInput value={data?.title} />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  作者
                </Text>
                <AuthorSelect value={data?.authors.map((v) => v.uuid) || []} onChange={() => {}} />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  出版社
                </Text>
                <PublisherSelect
                  value={data?.publishers.map((v) => v.uuid) || []}
                  onChange={() => {}}
                />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  ISBN
                </Text>
                <TextInput value={data?.isbn} />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  语言
                </Text>
                <Select value={data.language_id} />
              </Group>
              <Group gap="xs" align="flex-start">
                <Text fw={500} size="sm" w={100}>
                  描述
                </Text>
                <TextInput defaultValue={data.description} />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  出版日期
                </Text>
                <DatePickerInput placeholder="Pick date" value={data.publish_at} />
              </Group>
            </form>
          </Stack>
        </div>
      </div>
    );
  };
  return (
    <Modal opened={isOpen} onClose={setIsOpen} centered fullScreen>
      {data && renderContent()}
    </Modal>
  );
};
