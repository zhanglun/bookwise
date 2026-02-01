import { IconBook, IconDownload, IconEdit, IconEye } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Text,
  Tooltip,
  Transition,
} from '@mantine/core';
import { format } from 'date-fns';
import { AuthorResItem, BookResItem } from '@/interface/book';
import { Cover } from './Cover';
import classes from './list.module.css';

export interface BookListProps {
  data: BookResItem[];
  selectedBook?: BookResItem;
  onRowClick?: (row: BookResItem) => void;
  onRowDoubleClick?: (row: BookResItem) => void;
  onRead?: (uuid: string) => void;
  onEdit?: (row: BookResItem) => void;
  onDownload?: (row: BookResItem) => void;
}

export const BookList = (props: BookListProps) => {
  const {
    data,
    selectedBook,
    onRowClick,
    onRowDoubleClick,
    onRead,
    onEdit,
    onDownload,
  } = props;

  return (
    <div className={classes.grid}>
      {data.map((book) => (
        <div
          key={book.uuid}
          className={`${classes.card} ${selectedBook?.uuid === book.uuid ? classes.selected : ''}`}
          onClick={() => onRowClick?.(book)}
          onDoubleClick={() => onRowDoubleClick?.(book)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onRowClick?.(book);
            }
          }}
        >
          <div className={classes.cardContent}>
            <div className={classes.coverWrapper}>
              <Cover book={book} cover={book.cover} className={classes.coverImage} />
              <Badge className={classes.formatBadge} variant="filled" size="xs">
                {book.format?.toUpperCase()}
              </Badge>

              <Transition mounted={selectedBook?.uuid === book.uuid} transition="fade">
                {(styles) => (
                  <div className={classes.readOverlay} style={styles}>
                    <Button
                      variant="filled"
                      size="sm"
                      leftSection={<IconBook size="1rem" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRead?.(book.uuid);
                      }}
                    >
                      阅读
                    </Button>
                  </div>
                )}
              </Transition>
            </div>

            <div className={classes.info}>
              <Text lineClamp={2} fw={500} className={classes.title}>
                {book.title}
              </Text>

              <Text size="xs" c="dimmed" lineClamp={1} className={classes.authors}>
                {book.authors.map((author: AuthorResItem) => author.name).join(', ') || '未知作者'}
              </Text>

              <Text size="xs" c="dimmed" lineClamp={1} className={classes.publisher}>
                {book.publishers.map((p) => p.name).join(', ') || ''}
              </Text>

              <Group gap="xs" className={classes.metaRow}>
                <Text size="xs" c="dimmed">
                  {book.publish_at ? format(new Date(book.publish_at), 'yyyy-MM-dd') : ''}
                </Text>
                {book.page_size && (
                  <Text size="xs" c="dimmed">
                    {book.page_size} 页
                  </Text>
                )}
              </Group>
            </div>

            <Group gap="xs" className={classes.actions}>
              <Tooltip label="阅读" position="bottom">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead?.(book.uuid);
                  }}
                >
                  <IconEye size="1rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="编辑" position="bottom">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(book);
                  }}
                >
                  <IconEdit size="1rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="下载" position="bottom">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload?.(book);
                  }}
                >
                  <IconDownload size="1rem" />
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
        </div>
      ))}
    </div>
  );
};
