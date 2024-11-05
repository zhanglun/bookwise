import { useState } from "react";
import { Cover } from "@/components/Book/Cover";
import { BookResItem } from "@/interface/book";
import { RichMeta } from "./RichMeta";

export type InfoPanelType = {
  data: BookResItem | null;
};
export const InfoPanel = (props: InfoPanelType) => {
  const { data } = props;
  const [detail, setBookDetail] = useState<BookResItem | null>(null);

  //useEffect(() => {
  //  data && request.get(`books/${data.uuid}`).then(({ data }) => {
  //    console.log(data);
  //    setBookDetail(data);
  //  });
  //}, [data]);

  if (!data) {
    return <div>Please select item to view</div>;
  }

  return (
    <div>
      <h1 className="font-bold py-3 px-3 min-h-[49px] border-b border-border">{data.title}</h1>
      <div className="p-3">
        <Cover book={data} className="w-[60%] m-auto" />
      </div>
      <div>{data.description}</div>
      {/*<MetaForm defaultData={data} />*/}
      { data && <RichMeta defaultData={data} />}
    </div>
  );
};
