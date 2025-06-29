/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx';
import { ScrollArea, Text } from '@mantine/core';
import classes from './viewer.module.css';

export interface TocItem {
  label: string;
  href: string;
  subitems?: TocItem[];
  level?: number;
}

export interface TocProps {
  items?: TocItem[];
  className?: string;
  onItemClick?: (item: TocItem) => void;
}

export const Toc = ({ items = [], className, onItemClick }: TocProps) => {
  const handleItemClick = (item: TocItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const renderItems = (list: TocItem[], level = 0) => {
    return (list || []).map((item) => {
      const { label, href, subitems } = item;

      return (
        <div
          className={clsx(className)}
          key={href}
          style={{
            paddingLeft: `${Math.min(1, level) * 10}px`,
            marginBottom: level === 0 ? '8px' : '0',
          }}
        >
          <Text
            truncate
            size="sm"
            data-href={href}
            className={classes.tocItem}
            onClick={() => handleItemClick(item)}
          >
            {label}
          </Text>
          {subitems && subitems.length > 0 && <div>{renderItems(subitems, level + 1)}</div>}
        </div>
      );
    });
  };

  return (
    <ScrollArea className="h-full" type="hover">
      <div className={classes.toc}>{renderItems(items)}</div>
    </ScrollArea>
  );
};
