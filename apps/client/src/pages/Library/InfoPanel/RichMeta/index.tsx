import { BookResItem } from '@/interface/book';
import { AuthorField } from './AuthorField';
import { TitleField } from './TitleField';

export type RichMetaType = {
  defaultData: BookResItem;
};

export const RichMeta = (props: RichMetaType) => {
  const { defaultData } = props;
  const { uuid, title, description, authors } = defaultData;

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
      <TitleField label={'Title'} fieldName="title" initialValue={title} uuid={uuid} />
      <TitleField
        label={'Description'}
        fieldName="description"
        initialValue={description}
        uuid={uuid}
      />
      {/* <AuthorField
        label={"authors"}
        fieldName="authors"
        initialValue={authors}
        uuid={uuid}
      /> */}
    </div>
  );
};
