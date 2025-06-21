import { FC, useEffect, useState } from 'react';
import { Select, SelectProps } from '@mantine/core';
import { dal } from '@/dal';
import { LanguageResItem } from '@/interface/book';

export interface LanguageSelectProps extends Omit<SelectProps, 'onChange'> {
  // value: string;
  // onChange: (values: LanguageSelectProps['value'], rawOptions: any[]) => void;
}

export const LanguageSelect: FC<LanguageSelectProps> = ({ value, ...props }) => {
  const [, setLanguageList] = useState<LanguageResItem[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const getLanguageList = () => {
    dal.getLanguages().then((data) => {
      console.log('🚀 ~ dal.getLanguages ~ data:', data);
      setLanguageList(data);
      setOptions(data.map((language) => ({ value: language.uuid, label: language.name })));
    });
  };

  useEffect(() => {
    getLanguageList();
  }, []);

  return <Select data={options} placeholder="Pick languages" {...props} />;
};
