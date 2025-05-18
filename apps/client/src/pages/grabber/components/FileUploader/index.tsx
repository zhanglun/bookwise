import React from 'react';
import { Upload } from 'lucide-react';
import { Button, Group } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  return (
    <Dropzone
      onDrop={onFileSelect}
      accept={{
        'application/epub+zip': ['.epub'],
        'application/pdf': ['.pdf'],
        'application/x-mobipocket-ebook': ['.mobi'],
        'application/x-fictionbook+xml': ['.fb2'],
      }}
      className="flex flex-col items-center justify-center p-8"
    >
      <Group align="center">
        <Dropzone.Accept>
          <Upload className="w-12 h-12 text-blue-500 mb-4" />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <Upload className="w-12 h-12 text-red-500 mb-4" />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
        </Dropzone.Idle>

        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">拖放文件到这里，或者点击选择文件</p>
          <p className="mt-2 text-sm text-gray-500">支持的格式：EPUB、PDF、MOBI、FB2</p>
        </div>
      </Group>
    </Dropzone>
  );
};
