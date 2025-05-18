import React from 'react';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { BookResItem } from '@/interface/book';

interface BookFormProps {
  data?: BookResItem;
  onChange?: (data: Partial<BookResItem>) => void;
}

export const BookForm: React.FC<BookFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof BookResItem, value: any) => {
    onChange?.({ [field]: value });
  };

  return (
    <Stack spacing="md">
      <TextInput
        label="书名"
        value={data?.title || ''}
        onChange={(e) => handleChange('title', e.target.value)}
      />

      <TextInput
        label="作者"
        value={data?.author || ''}
        onChange={(e) => handleChange('author', e.target.value)}
      />

      <TextInput
        label="ISBN"
        value={data?.isbn || ''}
        onChange={(e) => handleChange('isbn', e.target.value)}
      />

      <TextInput
        label="出版社"
        value={data?.publisher || ''}
        onChange={(e) => handleChange('publisher', e.target.value)}
      />

      <DatePickerInput
        label="出版日期"
        value={data?.publishDate ? new Date(data.publishDate) : null}
        onChange={(date) => handleChange('publishDate', date?.toISOString().split('T')[0] || '')}
      />

      <Textarea
        label="简介"
        rows={4}
        value={data?.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
      />
    </Stack>
  );
};
