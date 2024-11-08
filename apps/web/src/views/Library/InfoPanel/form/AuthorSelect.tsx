import { useCallback, useEffect, useState } from "react";
import { AuthorResItem } from "@/interface/book";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/command";
import { Button, Badge, Popover } from "@radix-ui/themes";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import { dal } from "@/dal";
import { PopoverProps } from "@radix-ui/react-popover";

export interface AuthorSelectProps<T> extends PopoverProps {
  onChange: (value: T[]) => void;
  onBlur: () => void;
  value: T[];
}

export const AuthorSelect = <T,>({
  onChange,
  value = [],
  onBlur,
  onOpenChange,
  ...props
}: AuthorSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<T[]>([...value]);
  const [authorList, setAuthorList] = useState<AuthorResItem[]>([]);

  const getAuthorList = () => {
    dal.getAuthors().then((data) => {
      setAuthorList(data || []);
    });
  };

  const renderPlaceholder = useCallback(() => {
    if (selectedValues.length === 0) {
      return "Select authors for the book...";
    }

    const limit = 1;
    const showItems = authorList
      .filter((_) => {
        return selectedValues.some((v) => v.uuid === _.uuid);
      })
      .slice(0, limit)
      .map((_) => (
        <Badge
          variant="soft"
          className="rounded-sm px-1 font-normal max-w-full text-wrap"
        >
          {_.name}
        </Badge>
      ));

    if (selectedValues.length > limit) {
      showItems.push(
        <Badge variant="soft" className="rounded-sm px-1 font-normal">
          and more {selectedValues.length - limit} selected
        </Badge>
      );
    }

    return showItems;
  }, [selectedValues, authorList]);

  useEffect(() => {
    onChange(selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    setSelectedValues([...value]);
  }, [value]);

  useEffect(() => {
    getAuthorList();
  }, []);

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange} {...props}>
      <Popover.Trigger className="w-full text-left">
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a preset..."
          aria-expanded={open}
          className="flex-1 justify-between h-auto"
        >
          <div className="flex gap-1 flex-wrap min-h-5 py-[5px] w-full">
            {renderPlaceholder()}
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Add authors" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {authorList.map((author) => {
                const isSelected = selectedValues.some(
                  (v) => v.uuid === author.uuid
                );
                return (
                  <CommandItem
                    key={author.uuid}
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedValues(
                          selectedValues.filter((_) => {
                            return _ !== author.uuid;
                          })
                        );
                      } else {
                        setSelectedValues([...selectedValues, author]);
                      }
                    }}
                  >
                    <div
                      className={clsx(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={"h-4 w-4"} />
                    </div>
                    <span>{author.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
};
