import { useEffect, useState } from "react";
import { MetaForm } from "./form";
import { request } from "@/helpers/request";
import { Cover } from "@/components/Book/Cover";
import { BookResItem } from "@/interface/book";

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
      <h1>{data.title}</h1>
      <div>
        <Cover book={data} />
      </div>
      <div>{data.description}</div>
      <MetaForm defaultData={data} />
    </div>
  );
};
