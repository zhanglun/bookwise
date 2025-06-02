import { FC, useEffect, useState } from 'react';
import { MultiSelect } from '@mantine/core';
import { dal } from '@/dal';
import { PublisherResItem } from '@/interface/book';

export interface PublisherSelectProps {
  value: string[];
  onChange: (values: PublisherSelectProps['value'], rawOptions: any[]) => void;
}

export const PublisherSelect: FC<PublisherSelectProps> = ({ value, onChange }) => {
  const [selectedValues, setSelectedValues] = useState<PublisherSelectProps['value']>(value);
  const [publisherList, setPublisherList] = useState<PublisherResItem[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const getPublisherList = () => {
    dal.getPublishers().then((data) => {
      setPublisherList(data);
      setOptions(data.map((publisher) => ({ value: publisher.uuid, label: publisher.name })));
    });
  };

  const getOptions = (uuids: string[]) => {
    return publisherList.filter((publisher) => uuids.includes(publisher.uuid));
  };

  const handleChange = (values: string[]) => {
    setSelectedValues(values);
    onChange(values, getOptions(values));
  };

  useEffect(() => {
    getPublisherList();
  }, []);

  return (
    <MultiSelect
      data={options}
      placeholder="Pick publishers"
      value={selectedValues}
      onChange={handleChange}
    />
  );
};
