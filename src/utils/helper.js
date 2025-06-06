// 获取当前协议（带冒号，如 'https:'），动态匹配，让链接协议与当前页面协议一致
export const formateUrl = (url) => {
  if (!url) return '';
  const protocol = window.location.protocol;
  return url.replace(/^https?:/, protocol);
}

// 数据库时间格式 2025-06-06T08:47:38.000Z 转化为 2025年6月6日
export const formateDate = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  return `${year}年${month}月${day}日`;
}
