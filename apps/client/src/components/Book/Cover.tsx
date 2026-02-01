import { IconBook } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { CoverQueryRecord } from '@/dal/type';
import { BookResItem } from '@/interface/book';
import classes from './cover.module.css';

export interface CoverProps {
  book: BookResItem;
  className?: string;
  cover?: CoverQueryRecord;
  onClick?: (book: BookResItem) => void;
}

export const Cover = (props: CoverProps) => {
  const { onClick, book, cover, className } = props;
  const getBookCover = () => {
    if (cover) {
      try {
        const imageBlob = new Blob([cover.data as Uint8Array<ArrayBuffer>], { type: 'image/jpeg' });

        return URL.createObjectURL(imageBlob);
      } catch (error: any) {
        console.error('Error generating book cover URL:', {
          error,
          book,
          errorName: error.name,
          errorMessage: error.message,
        });
        return '';
      }
    }
    return '';
  };

  if (!cover) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={clsx(classes.placeholder, className)}
        onClick={() => onClick && onClick(book)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick && onClick(book);
          }
        }}
      >
        <IconBook size={48} stroke={1} className={classes.placeholderIcon} />
        <span className={classes.placeholderText}>{book.format?.toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={clsx(classes.coverContainer, className)}
      onClick={() => onClick && onClick(book)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick && onClick(book);
        }
      }}
    >
      <img src={getBookCover()} alt={book.title} className={classes.coverImage} />
    </div>
  );
};
