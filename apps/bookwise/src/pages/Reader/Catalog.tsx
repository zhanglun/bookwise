import { BookCatalog } from "@/helpers/parseEpub";
import clsx from "clsx";

export interface CatalogProps {
  data: BookCatalog[];
  onGoToPage: (id: string, href: string) => void;
}

export const Catalog = (props: CatalogProps) => {
  const { data, onGoToPage } = props;

  const goToPage = (id: string, href: string) => {
    onGoToPage(id, href);
  }

  const renderItems = (list: BookCatalog[], idx = 0) => {
    const styles = [
      'font-semibold mx-2',
      'font-normal mx-2',
    ];

    return list.map((item) => {
      const { id, label, href, subitems } = item;
      const Item = (
        <div data-idx={idx} className={clsx("text-sm mx-5", styles[idx])}>
          <div onClick={() => goToPage(id, href)}>
            {label}
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
    <div className="w-[260px] bg-white shadow-sm rounded-md border border-[#efefef] border-opacity-60 absolute top-[46px] left-0 bottom-2">
      <div className="px-4 py-3 h-full overflow-y-scroll">
        {renderItems(data)}
      </div>
    </div>
  );
};