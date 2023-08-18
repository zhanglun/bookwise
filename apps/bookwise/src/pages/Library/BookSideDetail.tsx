import { BookResItem } from "@/interface/book";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface BookSideDetailProps {
  data: BookResItem;
}
export const BookSideDetail = (props: BookSideDetailProps) => {
  const { data } = props;
  return (
    <div>
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <div className="text-base font-bold mb-3 leading-tight break-all flex">
            <span>{data.title}</span>
          </div>
          <div className="grid grid-cols-[minmax(max-content,auto)_minmax(0,1fr)] gap-1 pt-4 text-sm">
            <span>作者：</span>
            <span>{data.author?.name}</span>
            <span>出版商：</span>
            <span>{data.publisher?.name}</span>
            <span>出版日期：</span>
            <span>
              {data.publish_at &&
                format(new Date(data.publish_at), "yyyy-MM-dd")}
            </span>
            {/* <span>语言：</span>
        <span>{data.language}</span> */}
            <span>格式：</span>
            <span>{data.format}</span>
            <span>页数：</span>
            <span>{data.page_size}</span>
            <span>ISBN：</span>
            <span>{data.isbn}</span>
          </div>
        </TabsContent>
        <TabsContent value="notes">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};
