import { Book } from "@/components/Book";

export const Starred = () => {
  return (
    <div className="max-w-5xl m-auto  grid grid-flow-row gap-3">
      <div className="px-3 pt-7 pb-2 text-2xl font-bold text-stone-900">
        Starred
      </div>
      <div className="px-3 py-2 grid grid-flow-col grid-cols-5 gap-5">
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
      </div>
      <div className="px-3 pt-5 pb-2 text-xl font-bold text-stone-900">
        Recently reading
      </div>
      <div className="px-3 py-2 grid grid-flow-col grid-cols-5 gap-5">
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
        <Book data={{}} />
      </div>
    </div>
  );
};
