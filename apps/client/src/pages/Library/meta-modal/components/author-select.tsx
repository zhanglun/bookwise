import { FC, useEffect, useState } from 'react';
import { MultiSelect, MultiSelectProps } from '@mantine/core';
import { dal } from '@/dal';
import { AuthorResItem } from '@/interface/book';

export interface AuthorSelectProps extends Omit<MultiSelectProps, 'onChange'> {
  // value: string[];
  // onChange: (values: AuthorSelectProps['value'], rawOptions: any[]) => void;
}

export const AuthorSelect: FC<AuthorSelectProps> = ({ value, ...props }) => {
  const [, setAuthorList] = useState<AuthorResItem[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const getAuthorList = () => {
    dal.getAuthors().then((data) => {
      setAuthorList(data);
      setOptions(data.map((author) => ({ value: author.uuid, label: author.name })));
    });
  };

  useEffect(() => {
    getAuthorList();
  }, []);

  return <MultiSelect data={options} placeholder="Pick authors" {...props} />;
};
