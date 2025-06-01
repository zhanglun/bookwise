import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';
import { RichMeta } from './RichMeta';

export type InfoPanelType = {
  data?: BookResItem;
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
    <div>
      <div>
        <div>
          <Cover book={data} />
        </div>
        {/* {data && <RichMeta defaultData={data} />} */}
      </div>
    </div>
  );
};
