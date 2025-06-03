import { FC, useEffect, useState } from 'react';
import { Select } from '@mantine/core';
import { dal } from '@/dal';
import { LanguageResItem } from '@/interface/book';

export interface LanguageSelectProps {
  value: string;
  onChange: (values: LanguageSelectProps['value'], rawOptions: any[]) => void;
}

export const LanguageSelect: FC<LanguageSelectProps> = ({ value, onChange }) => {
  const [selectedValues, setSelectedValues] = useState<LanguageSelectProps['value']>(value);
  const [languageList, setLanguageList] = useState<LanguageResItem[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const getLanguageList = () => {
    dal.getLanguages().then((data) => {
      console.log('🚀 ~ dal.getLanguages ~ data:', data);
      setLanguageList(data);
      setOptions(data.map((language) => ({ value: language.uuid, label: language.name })));
    });
  };

  const getOptions = (uuid: string) => {
    return languageList.filter((language) => uuid === language.uuid);
  };

  const handleChange = (value: string) => {
    setSelectedValues(value);
    onChange(value, getOptions(value));
  };

  useEffect(() => {
    getLanguageList();
  }, []);

  return (
    <Select
      data={options}
      placeholder="Pick languages"
      value={selectedValues}
      onChange={(value) => handleChange(value as string)}
    />
  );
};
