import React, { useCallback, useEffect, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { request } from "@/helpers/request";
import { AuthorResItem } from "@/interface/book";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AuthorFilterProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {
  onValueChange?: any;
  defaultValue: string | null;
  className?: string | undefined;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

export const AuthorFilter = ({
  onValueChange,
  defaultValue = null,
  className,
  title,
  ...props
}: AuthorFilterProps) => {
  console.log("%c Line:38 🍋 AuthorFilterProps", "color:#ed9ec7", props);
  console.log("defaultValue", defaultValue);
  const [selectedValues, setSelectedValues] = useState([defaultValue]);
  const [authorList, setAuthorList] = useState<AuthorResItem[]>([]);

  const getAuthorList = () => {
    request.get("authors").then(({ data }) => {
      setAuthorList(data.items || []);
    });
  };

  const renderPlaceholder = useCallback(() => {
    if (selectedValues.length === 0) {
      return "Select authors for the book...";
    }

    const limit = 1;
    const showItems = authorList
      .filter((_) => selectedValues.includes(_.id))
      .slice(0, limit)
      .map((_) => (
        <Badge variant="secondary" className="rounded-sm px-1 font-normal">
          {_.name}
        </Badge>
      ));

    if (selectedValues.length > limit) {
      showItems.push(
        <Badge variant="secondary" className="rounded-sm px-1 font-normal">
          and more {selectedValues.length - limit} selected
        </Badge>
      );
    }

    return showItems;
  }, [selectedValues, authorList]);

  useEffect(() => {
    getAuthorList();
  }, []);

  useEffect(() => {
    onValueChange(selectedValues);
  }, [selectedValues, onValueChange]);

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 border-dashed justify-start"
    >
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          <props.icon className="h-4 w-4 text-foreground" />
          {title}
        </div>
        <div>is</div>
        <Popover {...props}>
          <PopoverTrigger asChild className="w-full text-left">
            <div>{renderPlaceholder()}</div>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Add authors" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {authorList.map((author) => {
                    const isSelected = selectedValues.indexOf(author.id) > -1;
                    return (
                      <CommandItem
                        key={author.id}
                        onSelect={() => {
                          if (isSelected) {
                            setSelectedValues(
                              selectedValues.filter((_) => {
                                return _ !== author.id;
                              })
                            );
                          } else {
                            setSelectedValues([...selectedValues, author.id]);
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
          </PopoverContent>
        </Popover>
      </div>
    </Button>
  );
};
