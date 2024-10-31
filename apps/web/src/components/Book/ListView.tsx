import { BookResItem } from "@/interface/book";
import { Table } from "@radix-ui/themes";
import { format } from "date-fns";

export interface ListViewProps {
  data: BookResItem[];
}

export const ListView = ({ data }: ListViewProps) => {
  return (
    <div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Public Date</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((book: BookResItem) => {
            return <Table.Row>
              <Table.RowHeaderCell maxWidth={400}>{book.title}</Table.RowHeaderCell>
              <Table.Cell>{(book.authors || []).join(',')}</Table.Cell>
              <Table.Cell>{format(book.publish_at, 'yyyy-MM-dd')}</Table.Cell>
            </Table.Row>;
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
