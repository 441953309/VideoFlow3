/**
 * 获取当前日期格式：11月5日
 * @returns 格式化的日期字符串
 */
export function getCurrentDateString(): string {
  const now = new Date();
  const month = now.getMonth() + 1; // 月份从0开始，需要+1
  const day = now.getDate();
  return `${month}月${day}日`;
}

