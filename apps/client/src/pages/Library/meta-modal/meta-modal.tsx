import { FC, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, Group, Modal, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Cover } from '@/components/Book/Cover';
import { dal } from '@/dal';
import { BookResItem } from '@/interface/book';
import { AuthorSelect } from './components/author-select';
import { LanguageSelect } from './components/language-select';
import { PublisherSelect } from './components/publisher-select';
import classes from './meta-modal.module.css';

export interface MetaModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  data?: BookResItem | null | undefined;
}

export const MetaModal: FC<MetaModalProps> = ({ isOpen, setIsOpen, data }) => {
  const { t } = useTranslation();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      isbn: '',
      description: '',
      author_uuids: [] as string[],
      publisher_uuids: [] as string[],
      publish_at: '' as string,
    },
  });

  useEffect(() => {
    if (data) {
      form.setValues({
        title: data.title,
        isbn: data.isbn,
        description: data.description,
        author_uuids: data.authors.map((v) => v.uuid) || [],
        publisher_uuids: data.publishers.map((v) => v.uuid) || [],
        publish_at: data.publish_at,
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    const values = form.getValues();

    if (!data || !data.uuid) {
      return;
    }

    console.log('🚀 ~ handleSubmit ~ values:', values);
    await dal.updateBook({
      uuid: data.uuid,
      ...values,
    });
  };

  const renderContent = () => {
    return (
      <div className={classes.content}>
        {data?.cover && (
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
                <TextInput key={form.key('title')} {...form.getInputProps('title')} />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  作者
                </Text>
                <AuthorSelect
                  key={form.key('author_uuids')}
                  {...form.getInputProps('author_uuids')}
                />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  出版社
                </Text>
                <PublisherSelect
                  key={form.key('publisher_uuids')}
                  {...form.getInputProps('publisher_uuids')}
                />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  ISBN
                </Text>
                <TextInput key={form.key('isbn')} {...form.getInputProps('isbn')} />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  语言
                </Text>
                <LanguageSelect
                  key={form.key('language_id')}
                  {...form.getInputProps('language_id')}
                />
              </Group>
              <Group gap="xs" align="flex-start">
                <Text fw={500} size="sm" w={100}>
                  描述
                </Text>
                <Textarea key={form.key('description')} {...form.getInputProps('description')} />
              </Group>
              <Group gap="xs">
                <Text fw={500} size="sm" w={100}>
                  出版日期
                </Text>
                <DatePickerInput
                  placeholder="Pick date"
                  valueFormat="YYYY-MM-DD"
                  key={form.key('publish_at')}
                  {...form.getInputProps('publish_at')}
                />
              </Group>
            </form>
          </Stack>
        </div>
      </div>
    );
  };
  return (
    <Modal
      opened={isOpen}
      onClose={setIsOpen}
      centered
      fullScreen
      withCloseButton={false}
      className={classes.modal}
    >
      <div className={classes.closeButton}>
        <ActionIcon onClick={setIsOpen} variant="default" color="gray">
          <IconX size={20} color="gray" />
        </ActionIcon>
      </div>
      {data && renderContent()}
      <div>
        <Group justify="flex-end" mt="md">
          <Button type="submit" onClick={handleSubmit}>
            {t('Save')}
          </Button>
        </Group>
      </div>
    </Modal>
  );
};
