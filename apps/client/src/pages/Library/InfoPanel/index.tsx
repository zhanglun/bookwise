import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';

// import { RichMeta } from './RichMeta';

export type InfoPanelType = {
  data: BookResItem | null;
};

export const InfoPanel = (props: InfoPanelType) => {
  const { data } = props;

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Please select item to view
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <h1 className="font-bold py-3 px-3 min-h-[49px] border-b border-border shrink-0">
        {data.title}
      </h1>
      <div className="flex-1 overflow-auto min-h-0">
        <div className="p-3">
          <Cover book={data} className="w-[60%] m-auto" />
        </div>
        {/* {data && <RichMeta defaultData={data} />} */}
      </div>
    </div>
  );
};
