import { format } from 'date-fns';
import {
  IconBook,
  IconCalendar,
  IconLanguage,
  IconBuilding,
  IconBarcode,
  IconFileTypePdf,
  IconX,
  IconBook2,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  ScrollArea,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';
import classes from './info-panel.module.css';

export type InfoPanelType = {
  data?: BookResItem;
  isOpen?: boolean;
  onClose?: () => void;
  onRead?: (uuid: string) => void;
};

export const InfoPanel = (props: InfoPanelType) => {
  const { data, isOpen, onClose, onRead } = props;
  const { cover } = data || {};

  if (!data || !isOpen) {
    return (
      <div className={classes.emptyState}>
        <IconBook2 size={48} stroke={1} className={classes.emptyIcon} />
        <Text size="sm" c="dimmed">
          选择一本书查看详情
        </Text>
      </div>
    );
  }

  return (
    <div className={classes.infoPanel}>
      <div className={classes.header}>
        <Tooltip label="关闭">
          <ActionIcon variant="subtle" color="gray" size="sm" onClick={onClose}>
            <IconX size="1rem" />
          </ActionIcon>
        </Tooltip>
      </div>

      <ScrollArea className={classes.scrollArea} scrollbarSize={6}>
        <div className={classes.content}>
          <div className={classes.coverWrapper}>
            <Cover book={data} cover={cover} className={classes.cover} />
            <Badge className={classes.formatBadge} variant="filled" size="sm">
              {data.format?.toUpperCase()}
            </Badge>
          </div>

          <div className={classes.bookInfo}>
            <Title order={4} className={classes.title} lineClamp={3}>
              {data.title}
            </Title>

            {data.authors.length > 0 && (
              <Group gap="xs" className={classes.metaRow}>
                <IconBook size="1rem" className={classes.metaIcon} />
                <Text size="sm" className={classes.metaValue} lineClamp={2}>
                  {data.authors.map((author) => author.name).join(', ')}
                </Text>
              </Group>
            )}

            {data.publishers.length > 0 && (
              <Group gap="xs" className={classes.metaRow}>
                <IconBuilding size="1rem" className={classes.metaIcon} />
                <Text size="sm" className={classes.metaValue} lineClamp={1}>
                  {data.publishers.map((p) => p.name).join(', ')}
                </Text>
              </Group>
            )}

            {data.isbn && (
              <Group gap="xs" className={classes.metaRow}>
                <IconBarcode size="1rem" className={classes.metaIcon} />
                <Text size="sm" className={classes.metaValue}>
                  {data.isbn}
                </Text>
              </Group>
            )}

            {data.language_id && (
              <Group gap="xs" className={classes.metaRow}>
                <IconLanguage size="1rem" className={classes.metaIcon} />
                <Text size="sm" className={classes.metaValue}>
                  {data.language_id}
                </Text>
              </Group>
            )}

            {data.page_size && (
              <Group gap="xs" className={classes.metaRow}>
                <IconFileTypePdf size="1rem" className={classes.metaIcon} />
                <Text size="sm" className={classes.metaValue}>
                  {data.page_size} 页
                </Text>
              </Group>
            )}

            {data.publish_at && (
              <Group gap="xs" className={classes.metaRow}>
                <IconCalendar size="1rem" className={classes.metaIcon} />
                <Text size="sm" className={classes.metaValue}>
                  {format(new Date(data.publish_at), 'yyyy-MM-dd')}
                </Text>
              </Group>
            )}

            {data.description && (
              <>
                <div className={classes.divider} />
                <div className={classes.sectionTitle}>简介</div>
                <Text size="sm" className={classes.description} lineClamp={10}>
                  {data.description}
                </Text>
              </>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        <Button
          fullWidth
          leftSection={<IconBook size="1rem" />}
          onClick={() => onRead?.(data.uuid)}
          variant="filled"
          size="md"
        >
          开始阅读
        </Button>
      </div>
    </div>
  );
};
