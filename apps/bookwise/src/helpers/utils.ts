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