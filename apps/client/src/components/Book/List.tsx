import { useState } from 'react';
import { IconDownload, IconEdit } from '@tabler/icons-react';
import { ActionIcon, Card, Group, Text, Tooltip } from '@mantine/core';
import { format } from 'date-fns';
import { AuthorResItem, BookResItem } from '@/interface/book';
import { Cover } from './Cover';
import classes from './list.module.css';

export interface BookListProps {
  data: BookResItem[];
  onRowClick?: (row: BookResItem) => void;
  onRowDoubleClick?: (row: BookResItem) => void;
  onEdit?: (row: BookResItem) => void;
  onDownload?: (row: BookResItem) => void;
}

export const BookList = (props: BookListProps) => {
  const { data, onRowClick, onRowDoubleClick, onEdit, onDownload } = props;
  const [selectedBook, setSelectedBook] = useState<BookResItem | null>(null);

  return (
    <div className={classes.grid}>
      {data.map((book) => (
        <Card
          key={book.uuid}
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
          className={`${classes.card} ${selectedBook?.uuid === book.uuid ? classes.selected : ''}`}
          onClick={() => {
            setSelectedBook(book);
            onRowClick?.(book);
          }}
          onDoubleClick={() => onRowDoubleClick?.(book)}
        >
          <div className={classes.cardContent}>
            <div className={classes.coverWrapper}>
              <Cover book={book} cover={book.cover} />
            </div>

            <div className={classes.info}>
              <Text lineClamp={2} fw={500} className={classes.title}>
                {book.title}
              </Text>

              <Text size="xs" c="dimmed" lineClamp={1} className={classes.authors}>
                {book.authors.map((author: AuthorResItem) => author.name).join(', ')}
              </Text>

              <Text size="xs" c="dimmed" lineClamp={1} className={classes.publisher}>
                {book.publishers.map((p) => p.name).join(', ')}
              </Text>

              <Text size="xs" c="dimmed" className={classes.date}>
                {book.publish_at ? format(new Date(book.publish_at), 'yyyy-MM-dd') : '-'}
              </Text>
            </div>

            <Group gap="xs" className={classes.actions}>
              <Tooltip label="编辑">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(book);
                  }}
                >
                  <IconEdit size="1rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="下载">
                <ActionIcon
                  variant="subtle"
                  color="blue"
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
        </Card>
      ))}
    </div>
  );
};
