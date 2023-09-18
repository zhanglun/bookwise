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
import { AuthorSelect } from "@/components/MetaForm/AuthorSelect";
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
    value: "author",
    label: "Author",
    icon: UserCircle2,
  },
  {
    value: "publisher",
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
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]);

  const handleFieldSelect = (option: keyof typeof options) => {
    console.log(option);
    setOpen(false);
    setSubMenuOpen(true);
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
                  const isSelected = selectedFilter.indexOf(option.value) > -1;
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        // if (isSelected) {
                        //   setSelectedFilter(
                        //     selectedFilter.filter((_) => {
                        //       return _ !== option.value;
                        //     })
                        //   );
                        // } else {
                        //   setSelectedFilter([...selectedFilter, option.value]);
                        // }
                        setSelectedFilter([...selectedFilter, option.value]);
                        handleFieldSelect(option);
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
        if (filter === "author") {
          return (
            <AuthorFilter
              defaultValue=""
              open={subMenuOpen}
              onOpenChange={setSubMenuOpen}
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
