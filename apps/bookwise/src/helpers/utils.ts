export const createCoverLink = (path: string): string => {
  const env = import.meta.env;
  let base = '';

  if (env.DEV) {
    base = 'http://localhost:9999';
  } else {
    base =  'http://localhost:9988';
  }
  return `${base}/books/cover?path=${path}`;
}