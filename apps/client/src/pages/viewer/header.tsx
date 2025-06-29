import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';

export interface ViewerHeaderProps {
  book: BookResItem;
}

export const ViewerHeader = ({ book }: ViewerHeaderProps) => {
  return (
    <div>
      <Cover book={book} />
      <span className="text-sm font-medium">{book.title}</span>
    </div>
  );
};
