import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const createCoverLink = (path: string): string => {
  const env = import.meta.env;
  let base = '';

  if (env.DEV) {
    base = 'http://localhost:9999/api';
  } else {
    base =  'http://localhost:9988/api';
  }
  return `${base}/books/cover?path=${encodeURIComponent(path)}`;
}

export function getRelativePath(url1, url2) {
  const url1Parts = url1.split('/');
  const url2Parts = url2.split('/');

  // 移除文件名
  url1Parts.pop();

  const replacedPathParts = [...url1Parts, ...url2Parts.slice(-1)];

  const replacedPath = replacedPathParts.join('/');

  return replacedPath;
}

