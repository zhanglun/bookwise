import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Building,
  Check,
  FileType,
  Languages,
  Plus,
  UserCircle2,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { clsx } from "clsx";
import { useState } from "react";
import { AuthorFilter } from "@/pages/Library/BookFilter/AuthorFilter";

export interface BookFilterProps {
  // options?: any[],
}

const options: {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "author.name",
    label: "Author",
    icon: UserCircle2,
  },
  {
    value: "publisher.name",
    label: "Publisher",
    icon: Building,
  },
  {
    value: "language",
    label: "Language",
    icon: Languages,
  },
  {
    value: "format",
    label: "Format",
    icon: FileType,
  },
];

export const Index = (props: BookFilterProps) => {
  const [title] = useState();
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    { open: boolean; value: string }[]
  >([]);

  const updateSelectedFilter = (idx: number, newData: { open: boolean; value: string }) => {
    selectedFilter[idx] = {
      ...newData,
    }

    setSelectedFilter([...selectedFilter]);
  }

  const handleFieldSelect = () => {
    setOpen(false);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <Plus size={16} />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        setSelectedFilter([
                          ...selectedFilter,
                          { open: true, value: option.value },
                        ]);
                        handleFieldSelect();
                      }}
                    >
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedFilter.map((filter, idx) => {
        if (filter.value === "author") {
          return (
            <AuthorFilter
              defaultValue=""
              open={filter.open}
              onOpenChange={(status) => {
                updateSelectedFilter(idx, {...filter, open: status})
              }}
              icon={UserCircle2}
              title={"Author"}
              onValueChange={(value: any[]) => {
                console.log("%c Line:129 🍩 idx", "color:#42b983", idx);
                console.log("%c Line:130 🥔 value", "color:#6ec1c2", value);
              }}
            />
          );
        }
      })}
    </div>
  );
};
