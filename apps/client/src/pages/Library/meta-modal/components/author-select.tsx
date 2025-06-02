import { FC, useEffect, useState } from 'react';
import { MultiSelect } from '@mantine/core';
import { dal } from '@/dal';
import { AuthorResItem } from '@/interface/book';

export interface AuthorSelectProps {
  value: string[];
  onChange: (values: AuthorSelectProps['value'], rawOptions: any[]) => void;
}

export const AuthorSelect: FC<AuthorSelectProps> = ({ value, onChange }) => {
  const [selectedValues, setSelectedValues] = useState<AuthorSelectProps['value']>(value);
  const [authorList, setAuthorList] = useState<AuthorResItem[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const getAuthorList = () => {
    dal.getAuthors().then((data) => {
      setAuthorList(data);
      setOptions(data.map((author) => ({ value: author.uuid, label: author.name })));
    });
  };

  const getOptions = (uuids: string[]) => {
    return authorList.filter((author) => uuids.includes(author.uuid));
  };

  const handleChange = (values: string[]) => {
    setSelectedValues(values);
    onChange(values, getOptions(values));
  };

  useEffect(() => {
    getAuthorList();
  }, []);

  return (
    <MultiSelect
      data={options}
      placeholder="Pick authors"
      value={selectedValues}
      onChange={handleChange}
    />
  );
};
