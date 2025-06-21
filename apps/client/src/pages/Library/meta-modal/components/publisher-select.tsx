import { FC, useEffect, useState } from 'react';
import { MultiSelect, MultiSelectProps } from '@mantine/core';
import { dal } from '@/dal';
import { PublisherResItem } from '@/interface/book';

export interface PublisherSelectProps extends Omit<MultiSelectProps, 'onChange'> {}

export const PublisherSelect: FC<PublisherSelectProps> = ({ value, ...props }) => {
  const [, setPublisherList] = useState<PublisherResItem[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const getPublisherList = () => {
    dal.getPublishers().then((data) => {
      setPublisherList(data);
      setOptions(data.map((publisher) => ({ value: publisher.uuid, label: publisher.name })));
    });
  };

  useEffect(() => {
    getPublisherList();
  }, []);

  return <MultiSelect data={options} placeholder="Pick publishers" {...props} />;
};
