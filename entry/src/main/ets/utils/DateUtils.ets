/**
 * 日期工具类
 * @description 提供日期时间相关的工具方法
 * @since API version 12
 */

/**
 * 格式化当前日期为中文格式
 * @returns 格式化后的日期字符串，如"10月25日"
 */
export function formatCurrentDate(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${month}月${day}日`;
}

/**
 * 格式化时间为HH:MM格式
 * @returns 格式化后的时间字符串，如"14:30"
 */
export function formatCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 格式化日期时间为完整格式
 * @returns 格式化后的日期时间字符串，如"2025-10-25 14:30:00"
 */
export function formatDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 获取今天的日期字符串（YYYY-MM-DD）
 * @returns 今天的日期
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取N天前的日期字符串（YYYY-MM-DD）
 * @param days 天数
 * @returns N天前的日期
 */
export function getDateBeforeDays(days: number): string {
  const now = new Date();
  now.setDate(now.getDate() - days);
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

