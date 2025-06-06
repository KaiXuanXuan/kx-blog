export const formateUrl = (url) => {
  if (!url) return '';
  // 获取当前协议（带冒号，如 'https:'），动态匹配，让链接协议与当前页面协议一致
  const protocol = window.location.protocol;
  return url.replace(/^https?:/, protocol);
}