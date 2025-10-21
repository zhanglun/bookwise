export function getAbsoluteUrl(basePath: string, relativePath: string) {
  const basePathParts = basePath.split('/');
  const relativePathParts = relativePath.split('/');

  // 移除基础路径的最后一个元素，即文件名或最后的目录部分
  basePathParts.pop();

  relativePathParts.forEach((part: string) => {
    if (part !== '.') {
      if (part === '..') {
        // 向上一级目录，移除基础路径的最后一个元素
        basePathParts.pop();
      } else {
        // 向下一级目录，将当前部分添加到基础路径
        basePathParts.push(part);
      }
    }
  });

  console.log('%c Line:33 🌽 basePathParts', 'color:#6ec1c2', basePathParts);

  const absolutePath = basePathParts.filter((_) => _).join('/');

  return absolutePath;
}
