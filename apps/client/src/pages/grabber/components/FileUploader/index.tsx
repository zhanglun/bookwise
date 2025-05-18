import React, { useState } from 'react';
import { CheckCircle, Upload, XCircle } from 'lucide-react';
import { Group, Progress, Stack, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import classes from './fileUploader.module.css';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
}

interface UploadStatus {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    progress: 0,
    status: 'idle',
  });

  const handleDrop = async (files: File[]) => {
    try {
      setUploadStatus({
        progress: 0,
        status: 'uploading',
        message: '正在处理文件...',
      });

      // 模拟上传进度
      const interval = setInterval(() => {
        setUploadStatus((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 200);

      // 调用实际的文件处理函数
      await onFileSelect(files);

      clearInterval(interval);
      setUploadStatus({
        progress: 100,
        status: 'success',
        message: '文件处理成功！',
      });

      notifications.show({
        title: '成功',
        message: '文件已成功上传并处理',
        color: 'green',
      });
    } catch (error) {
      setUploadStatus({
        progress: 0,
        status: 'error',
        message: '文件处理失败，请重试',
      });

      notifications.show({
        title: '错误',
        message: '文件处理失败，请重试',
        color: 'red',
      });
    }
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      accept={{
        'application/epub+zip': ['.epub'],
        'application/pdf': ['.pdf'],
        'application/x-mobipocket-ebook': ['.mobi'],
        'application/x-fictionbook+xml': ['.fb2'],
      }}
      className={classes.uploader}
    >
      <Stack align="center" style={{ width: '100%' }}>
        <Group align="center">
          {uploadStatus.status === 'success' && <CheckCircle className={classes.iconSuccess} />}
          {uploadStatus.status === 'error' && <XCircle className={classes.iconError} />}
          {uploadStatus.status === 'idle' && (
            <>
              <Dropzone.Accept>
                <Upload className={classes.iconAccept} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <Upload className={classes.iconReject} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <Upload className={classes.iconIdle} />
              </Dropzone.Idle>
            </>
          )}

          <div className="text-center">
            {uploadStatus.status === 'idle' ? (
              <>
                <p className="text-lg text-gray-600 mb-2">拖放文件到这里，或者点击选择文件</p>
                <p className="mt-2 text-sm text-gray-500">支持的格式：EPUB、PDF、MOBI、FB2</p>
              </>
            ) : (
              <Text size="lg" color={uploadStatus.status === 'error' ? 'red' : 'gray'}>
                {uploadStatus.message}
              </Text>
            )}
          </div>
        </Group>

        {uploadStatus.status === 'uploading' && (
          <Progress
            value={uploadStatus.progress}
            size="xl"
            radius="xl"
            striped
            style={{ width: '80%' }}
          />
        )}
      </Stack>
    </Dropzone>
  );
};
