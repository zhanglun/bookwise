import { BookResItem } from "@/interface/book";
import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const styles = {
  row: "text-sm border-b transition-colors hover:bg-[var(--gray-a3)] data-[state=selected]:bg-[var(--gray-a4)] hover:bg-[var(--gray-a3)] cursor-default",
  th: "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  td: "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
};

export interface DataTableProps {
  data: BookResItem[];
  onRowClick: (row: BookResItem) => void;
  onRowDoubleClick?: (row: BookResItem) => void;
}

export const DataTable = (props: DataTableProps) => {
  const { data, onRowClick, onRowDoubleClick } = props;
  const columns = useMemo(() => {
    return [
      {
        accessorKey: "title",
        header: "Name",
        //min: 300,
        //max: 540,
        cell: ({ row }) => (
          <div className="text-ellipsis overflow-hidden whitespace-nowrap">
            {row.getValue("title")}
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "authors",
        header: "Author",
        //min: 200,
        //max: 340,
        cell: ({ row }) => (
          <div className="text-ellipsis overflow-hidden whitespace-nowrap">
            {(row.getValue("authors") || []).map((author) => (
              <div key={author.name}>{author.name}</div>
            ))}
          </div>
        ),
      },
    ];
  }, []);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full table-fixed text-sm">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className={styles.row}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{
                  width: header.getSize(),
                }}
                className={styles.th}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={styles.row}
            onClick={() => onRowClick(row.original)}
            onDoubleClick={() => onRowDoubleClick?.(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={styles.td}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
};
