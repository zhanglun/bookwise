import { useCallback, useState, ReactNode } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { debounce } from 'lodash-es';
import { Input } from '@mantine/core';
import { Uploader } from '@/components/Uploader';
import classes from './library.module.css';

interface LibraryToolbarProps {
  onUploadComplete?: () => void;
  children?: ReactNode;
}

export const LibraryToolbar = ({ onUploadComplete, children }: LibraryToolbarProps) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedQuery = useCallback(
    debounce((q) => {
      console.log('🚀 ~ file: index.tsx:19 ~ debounce ~ q:', q);
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
    <div className={classes.toolbar}>
      <div className={classes.toolbarLeft}>
        <Uploader onUploadComplete={onUploadComplete} />
      </div>
      <div className={classes.toolbarRight}>
        <Input
          size="sm"
          placeholder="搜索书籍..."
          value={query}
          onChange={handleQueryChange}
          onKeyUp={handleStartQuery}
          leftSection={<IconSearch height="18" width="18" />}
          rightSection={
            query && !searching ? (
              <IconX
                height="18"
                width="18"
                onClick={() => {
                  setQuery('');
                  debouncedQuery('');
                }}
                className={classes.clearIcon}
              />
            ) : searching ? (
              <IconSearch size="1" />
            ) : null
          }
          className={classes.searchInput}
        />
        <div className={classes.toolbarActions}>{children}</div>
      </div>
    </div>
  );
};
