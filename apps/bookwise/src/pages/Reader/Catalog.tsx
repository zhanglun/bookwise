import { BookCatalog } from "@/helpers/parseEpub";

export interface CatalogProps {
  data: BookCatalog[];
}

export const Catalog = (props: CatalogProps) => {
  const { data } = props;

  const renderItems = (list: BookCatalog[], idx = 0) => {
    return list.map((item) => {
      const { id, label, subitems } = item;
      const Item = (
        <div data-idx={idx}>
          <div>
            {idx} -- {label}
          </div>
          {subitems.length > 0 && (
            <div className="bg-slate-500">{renderItems(subitems, idx + 1)}</div>
          )}
        </div>
      );
      return Item;
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-md border border-[#efefef] border-opacity-60 absolute top-4 left-6 bottom-4 h-screen">
      <div className="px-4 py-3">
        {renderItems(data)}
      </div>
    </div>
  );
};
