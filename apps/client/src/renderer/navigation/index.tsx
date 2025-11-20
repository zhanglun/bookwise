import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { ActionIcon, Slider } from '@mantine/core';
import { Book } from '../types';
import styles from './navigation.module.css';

export interface NavigationBarProps {
  currentIndex: number;
  progress: number;
  isLoading: boolean;
  prev: () => void;
  next: () => void;
  onProgressChange: (value: number) => void;
  book: Book;
}

export const NavigationBar = ({
  currentIndex,
  progress,
  isLoading,
  prev,
  next,
  onProgressChange,
  book,
}: NavigationBarProps) => {
  return (
    <div className={styles.nav}>
      <ActionIcon
        onClick={prev}
        disabled={currentIndex === 0 || isLoading}
        size="lg"
        variant="subtle"
      >
        <IconChevronLeft />
      </ActionIcon>

      <Slider
        value={progress}
        onChange={onProgressChange}
        min={0}
        max={1}
        step={0.001}
        disabled={isLoading}
        style={{ flex: 1, margin: '0 16px' }}
        marks={book?.sections?.map((_, index) => ({
          value: index / (book.sections.length - 1),
        }))}
      />

      <ActionIcon
        onClick={next}
        disabled={currentIndex >= (book?.sections?.length ?? 0) - 1 || isLoading}
        size="lg"
        variant="subtle"
      >
        <IconChevronRight />
      </ActionIcon>
    </div>
  );
};
