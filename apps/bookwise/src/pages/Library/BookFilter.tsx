import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, Plus, UserCircle2 } from "lucide-react";
import {
  Command, CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { clsx } from "clsx";
import { useState } from "react";

export interface BookFilterProps {
  // options?: any[],
}

const options: {
  value: string,
  label: string,
  icon?: React.ComponentType<{ className?: string }>
}[] = [
  {
    value: "author",
    label: "Author",
    icon: UserCircle2
  }
];

export const BookFilter = (props: BookFilterProps) => {
  const [title] = useState();
  const [selectedValues] = useState([]);

  return <Popover>
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
              const isSelected = selectedValues.indexOf(option.value) > -1
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (isSelected) {
                      // selectedValues.(option.value)
                    } else {
                      selectedValues.push(option.value)
                    }
                    const filterValues = Array.from(selectedValues)
                    column?.setFilterValue(
                      filterValues.length ? filterValues : undefined
                    )
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
                  {option.icon && (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{option.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
          {selectedValues.size > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => column?.setFilterValue(undefined)}
                  className="justify-center text-center"
                >
                  Clear filters
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
}
