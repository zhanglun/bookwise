/**
 * 从字符串中移除 HTML 标签
 * @param html 包含 HTML 标签的字符串
 * @returns 移除 HTML 标签后的纯文本
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  // 创建一个临时的 div 元素
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  
  // 获取纯文本内容
  return tmp.textContent || tmp.innerText || '';
}

/**
 * 从字符串中移除 HTML 标签（使用正则表达式）
 * 这是一个备选方案，当 DOM 操作不可用时使用
 * @param html 包含 HTML 标签的字符串
 * @returns 移除 HTML 标签后的纯文本
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // 移除所有 HTML 标签
  return html.replace(/<[^>]*>/g, '');
}
