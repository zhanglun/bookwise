import {
  Button,
  IconButton,
  Popover,
  Spinner,
  TextField,
} from "@radix-ui/themes";
import { Command } from "cmdk";
import { ListFilterIcon } from "lucide-react";
import { useCallback, useState } from "react";
import {
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/command";
import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { debounce } from "lodash-es";
import { useBearStore } from "@/store";
import { set } from "date-fns";

export const LibraryToolbar = () => {
  const store = useBearStore((state) => ({
    getBooks: state.getBooks,
  }));
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const debouncedQuery = useCallback(
    debounce((q) => {
      console.log("🚀 ~ file: index.tsx:19 ~ debounce ~ q:", q);
      const params = {
        title: q,
      };
      store.getBooks(params).finally(() => {
        setSearching(false);
      });
    }, 300),
    []
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);
    setSearching(true);
    debouncedQuery(value);
  };

  const handleStartQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    setSearching(true);
    debouncedQuery(value);
  };

  return (
    <div className="py-2 px-2 flex items-center justify-between">
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
      <div className="flex items-center gap-3">
        <TextField.Root
          placeholder="Search the books..."
          value={query}
          onChange={handleQueryChange}
          onKeyUp={handleStartQuery}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
          <TextField.Slot>
            {query && !searching && (
              <CrossCircledIcon
                height="16"
                width="16"
                onClick={() => {
                  setQuery("");
                  debouncedQuery("");
                }}
                className="cursor-pointer hover:text-[var(--gray-12)]"
              />
            )}
            {searching && <Spinner size="1" />}
          </TextField.Slot>
        </TextField.Root>
      </div>
    </div>
  );
};
