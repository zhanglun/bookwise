import { BookResItem } from "@/interface/book";
import { TitleField } from "./TitleField";

export type RichMetaType = {
  defaultData: BookResItem
};

export const RichMeta = (props: RichMetaType) => {
  const { defaultData = {} } = props;
  const { title } = defaultData;

  return (
    <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
      <TitleField label={"Title"} initialValue={title} />
    </div>
  );
};
