import { BookCatalog } from "@/helpers/parseEpub";
import clsx from "clsx";

export interface CatalogProps {
  data: BookCatalog[];
}

export const Catalog = (props: CatalogProps) => {
  const { data } = props;

  const renderItems = (list: BookCatalog[], idx = 0) => {
    const styles = [
      'font-semibold mx-5',
      'font-normal mx-5',
    ];

    return list.map((item) => {
      const { id, label, subitems } = item;
      const Item = (
        <div data-idx={idx} className={clsx("text-sm mx-5", styles[idx])}>
          <div>
            {idx} -- {label}
          </div>
          {subitems.length > 0 && (
            <div className="">{renderItems(subitems, idx + 1)}</div>
          )}
        </div>
      );
      return Item;
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-md border border-[#efefef] border-opacity-60 absolute top-[46px] left-0 bottom-2">
      <div className="px-4 py-3 h-full overflow-y-scroll">
        {renderItems(data)}
      </div>
    </div>
  );
};
