import { Cover } from "@/components/Book/Cover";
import { BookResItem } from "@/interface/book";

export interface BookSideDetailProps {
  data: BookResItem;
}
export const BookSideDetail = (props: BookSideDetailProps) => {
  const { data } = props;
  return (
    <div>
      <Cover book={data} />
      <div className="grid grid-cols-[minmax(max-content,auto)_minmax(0,1fr)] gap-1 pt-4 text-sm">
        <span>书名：</span>
        <span>{data.title}</span>
        <span>作者：</span>
        <span>{data.author}</span>
        <span>出版商：</span>
        <span>{data.publisher}</span>
        <span>出版日期：</span>
        <span>{data.publish_at}</span>
        <span>语言：</span>
        <span>{data.language}</span>
        <span>格式：</span>
        <span>{data.format}</span>
        <span>页数：</span>
        <span>{data.pagesize}</span>
        <span>ISBN：</span>
        <span>{data.isbn}</span>
      </div>
    </div>
  );
};
