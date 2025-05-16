import { useMemo, useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AuthorResItem, BookResItem } from '@/interface/book';
import classes from './table.module.css';

export interface DataTableProps {
  data: BookResItem[];
  onRowClick: (row: BookResItem) => void;
  onRowDoubleClick?: (row: BookResItem) => void;
}

export const DataTable = (props: DataTableProps) => {
  const { data, onRowClick, onRowDoubleClick } = props;
  console.log('🚀 ~ DataTable ~ data:', data);
  const [selectedRow, setSelectedRow] = useState<BookResItem | null>(null);
  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'title',
        header: 'Name',
        //min: 300,
        //max: 540,
        cell: ({ row }: any) => (
          <div className="text-ellipsis overflow-hidden whitespace-nowrap">
            {row.getValue('title')}
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'authors',
        header: 'Author',
        //min: 200,
        //max: 340,
        cell: ({ row }: any) => (
          <div className="text-ellipsis overflow-hidden whitespace-nowrap">
            {(row.getValue('authors') || []).map((author: AuthorResItem) => (
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
          <tr key={headerGroup.id} className={classes.row}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{
                  width: header.getSize(),
                }}
                className={classes.th}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.original.uuid}
            className={`${classes.row} ${selectedRow?.uuid === row.original.uuid ? classes.selected : ''}`}
            onClick={() => {
              setSelectedRow(row.original);
              onRowClick(row.original);
            }}
            onDoubleClick={() => onRowDoubleClick?.(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={classes.td}>
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
                  : flexRender(header.column.columnDef.footer, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
};
