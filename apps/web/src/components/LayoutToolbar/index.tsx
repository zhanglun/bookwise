import { Button, Popover, TextField } from "@radix-ui/themes";
import { Command } from "cmdk";
import { ListFilterIcon } from "lucide-react";
import { useCallback, useState } from "react";
import {
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "../command";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { debounce } from "lodash-es";
import { useBearStore } from "@/store";

export const LayoutToolbar = () => {
  const store = useBearStore((state) => ({
    getBooks: state.getBooks,
  }));
  const [query, setQuery] = useState("");

  const debouncedQuery = useCallback(
    debounce((q) => {
      console.log("🚀 ~ file: index.tsx:19 ~ debounce ~ q:", q);
      const params = {
        title: q,
      };
      store.getBooks(params);
    }, 300),
    []
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleStartQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    debouncedQuery(value);
  };

  return (
    <div className="my-3 flex items-center justify-between">
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="ghost">
            <ListFilterIcon size={16} />
            Filter
          </Button>
        </Popover.Trigger>
        <Popover.Content className="p-0">
          <Command>
            <CommandInput
              className="outline-none border-none bg-transparent"
              placeholder="Filter..."
            />

            <CommandList>
              {/* {loading && <Command.Loading>Hang on…</Command.Loading>} */}

              <Command.Empty>No results found.</Command.Empty>

              <CommandGroup>
                <CommandItem>Apple</CommandItem>
                <CommandItem>Banana</CommandItem>
                <CommandItem>Orange</CommandItem>
                <Command.Separator />
                <CommandItem>Pear</CommandItem>
                <CommandItem>Blueberry</CommandItem>
              </CommandGroup>

              <CommandItem>Fish</CommandItem>
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover.Root>
      <div>
        <TextField.Root
          placeholder="Search the books..."
          value={query}
          onChange={handleQueryChange}
          onKeyUp={handleStartQuery}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
      </div>
    </div>
  );
};
