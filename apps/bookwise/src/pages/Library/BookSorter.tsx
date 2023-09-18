import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fields = [
  {
    key: "author",
    label: "Author",
  },
  {
    key: "publisher",
    label: "Publisher",
  },
  {
    key: "datelastopened",
    label: "Date last opened",
  },
  {
    key: "datepublished",
    label: "Date published",
  },
  {
    key: "datesaved",
    label: "Date saved",
  },
  {
    key: "length",
    label: "Length",
  },
  {
    key: "readprogress",
    label: "Read progress",
  },
  {
    key: "title",
    label: "Title",
  },
];

export const BookSorter = () => {
  const [ showLabel, setShowLabel ] = useState('Author');
  const [ checkedField, setCheckedField ] = useState("author");
  const [ orderBy, setOrderBy ] = useState("desc");

  useEffect(() => {
    const cur = fields.filter((_) => _.key === checkedField);

    setShowLabel(cur[0].label)
  }, [ checkedField ]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="sm">
            <span className="flex items-center gap-1 mr-1">
              { orderBy === "desc" && <ArrowDownWideNarrow size="16"/> }
              { orderBy === "asc" && <ArrowUpWideNarrow size={ 16 }/> }
              { showLabel }
            </span>
            <ChevronDown size="16"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          { fields.map((field) => {
            return (
              <DropdownMenuCheckboxItem
                key={ field.key }
                checked={ checkedField === field.key }
                onCheckedChange={ () => setCheckedField(field.key) }
              >
                { field.label }
              </DropdownMenuCheckboxItem>
            );
          }) }
          <DropdownMenuSeparator/>
          <DropdownMenuLabel>Order by</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={ orderBy === "asc" }
            onCheckedChange={ () => setOrderBy("asc") }
          >
            ASC
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={ orderBy === "desc" }
            onCheckedChange={ () => setOrderBy("desc") }
          >
            DESC
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
