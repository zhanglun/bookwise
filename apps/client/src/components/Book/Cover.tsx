import { clsx } from 'clsx';
import { CoverQueryRecord } from '@/dal/type';
import { BookResItem } from '@/interface/book';

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

  return cover ? (
    <div
      role="button"
      tabIndex={0}
      className={clsx(
        'relative rounded-sm',
        'shadow-[0px_0px_0px_1.11765px_rgba(0,0,0,0.03),0px_16.7647px_21.2353px_-14.5294px_rgba(0,0,0,0.2),0px_4.2439px_20.3859px_rgba(0,0,0,0.0715329),0px_1.26352px_1.41217px_rgba(0,0,0,0.0484671)]',
        "before:content-[' '] before:absolute before:z-50 before:top-0 before:left-0 before:right-0 before:bottom-0",
        'before:bg-[linear-gradient(360deg,_rgba(0,_0,_0,_0.05)_0%,_rgba(255,_255,_255,_0.15)_100%)]',
        "after:content-[''] after:absolute after:inset-0 after:r-auto after:w-[10px]",
        'after:bg-[linear-gradient(90deg,rgba(255,255,255,0.4)_0%,rgba(0,0,0,0.08)40%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_80%)]',
        className
      )}
      onClick={() => onClick && onClick(book)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick && onClick(book);
        }
      }}
    >
      <img src={getBookCover()} alt="" className="object-cover rounded-sm" />
    </div>
  ) : (
    <div />
  );
};
