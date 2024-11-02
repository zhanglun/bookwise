import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/command";
import * as Form from "@radix-ui/react-form";
import React, { useCallback, useEffect, useState } from "react";
import { AuthorResItem } from "@/interface/book";
import { request } from "@/helpers/request";
import { Badge, Button, Popover, ScrollArea } from "@radix-ui/themes";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";

export const AuthorField = ({ label, field }) => {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(field.value || []);
  const [authorList, setAuthorList] = useState<AuthorResItem[]>([]);

  const getAuthorList = () => {
    request.get("authors").then(({ data }) => {
      setAuthorList(data || []);
    });
  };

  const renderPlaceholder = useCallback(() => {
    if (selectedValues.length === 0) {
      return "Select authors for the book...";
    }

    const limit = 2;
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
    field.onChange(selectedValues);
  }, [selectedValues]);

  return (
    <Form.Field name={label}>
      <Form.Label>{label}</Form.Label>
      <Form.Control asChild>
        <div>
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger>
              <Button
                variant="outline"
                role="combobox"
                aria-label="Load a preset..."
                aria-expanded={open}
                className="flex-1 justify-between"
              >
                <div className="flex gap-1">{renderPlaceholder()}</div>
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </Popover.Trigger>
            <Popover.Content className="w-[200px] p-0">
              <Command>
                <CommandInput />
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
                          <span>{author.name}</span>
                          <CheckIcon
                            className={clsx(
                              "ml-auto h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </Popover.Content>
          </Popover.Root>
        </div>
      </Form.Control>
    </Form.Field>
  );
};
