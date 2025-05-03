import { useCallback, useState } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { debounce } from 'lodash-es';
import { Button, IconButton, Input, Popover, Spinner, TextField } from '@mantine/core';

export const LibraryToolbar = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedQuery = useCallback(
    debounce((q) => {
      console.log('🚀 ~ file: index.tsx:19 ~ debounce ~ q:', q);
      const params = {
        title: q,
      };
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
      <div className="flex items-center gap-3">asdfasdf</div>
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search the books..."
          value={query}
          onChange={handleQueryChange}
          onKeyUp={handleStartQuery}
          leftSection={<IconSearch height="16" width="16" />}
          rightSection={
            query && !searching ? (
              <IconX
                height="16"
                width="16"
                onClick={() => {
                  setQuery('');
                  debouncedQuery('');
                }}
                className="cursor-pointer hover:text-[var(--gray-12)]"
              />
            ) : searching ? (
              <IconSearch size="1" />
            ) : null
          }
        />
      </div>
    </div>
  );
};
