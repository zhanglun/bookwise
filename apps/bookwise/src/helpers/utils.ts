import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const createCoverLink = (path: string): string => {
  const env = import.meta.env;
  let base = "";

  if (env.DEV) {
    base = "http://localhost:9999/api";
  } else {
    base = "http://localhost:9988/api";
  }
  return `${base}/books/cover?path=${encodeURIComponent(path)}`;
};

export function getAbsoluteUrl(basePath: string, relativePath: string) {
  const basePathParts = basePath.split("/");
  const relativePathParts = relativePath.split("/");

  // 移除基础路径的最后一个元素，即文件名或最后的目录部分
  basePathParts.pop();

  relativePathParts.forEach((part: string) => {
    if (part !== ".") {
      if (part === "..") {
        // 向上一级目录，移除基础路径的最后一个元素
        basePathParts.pop();
      } else {
        // 向下一级目录，将当前部分添加到基础路径
        basePathParts.push(part);
      }
    }
  });

  const absolutePath = basePathParts.join("/");
  return absolutePath;
}
