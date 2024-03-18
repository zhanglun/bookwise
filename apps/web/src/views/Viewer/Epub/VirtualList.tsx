import { List } from "react-virtualized";

export interface VirtualListProps {
  pages: React.ReactNode[];
}
// Render your list
export const VirtualList = ({ pages }: VirtualListProps) => {
  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    return (
      <div key={key} style={style}>
        {pages[index]}
      </div>
    );
  }

  return (
    <List
      width={300}
      height={300}
      rowCount={pages.length}
      rowHeight={20}
      rowRenderer={rowRenderer}
    />
  );
};
