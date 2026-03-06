/**
 * 资源管理工具类
 * @description 提供定时器、订阅等资源的管理方法
 * @since API version 12
 */

/**
 * 定时器管理类
 * @description 管理所有定时器的创建和清理
 */
export class TimerManager {
  private timers: Map<string, number> = new Map();
  
  /**
   * 创建定时器
   * @param key 定时器唯一标识
   * @param callback 回调函数
   * @param interval 间隔时间（毫秒）
   */
  setInterval(key: string, callback: () => void, interval: number): void {
    // 如果已存在同名定时器，先清除
    this.clearInterval(key);
    
    const timerId = setInterval(callback, interval);
    this.timers.set(key, timerId);
  }
  
  /**
   * 创建延时器
   * @param key 定时器唯一标识
   * @param callback 回调函数
   * @param delay 延迟时间（毫秒）
   */
  setTimeout(key: string, callback: () => void, delay: number): void {
    // 如果已存在同名定时器，先清除
    this.clearTimeout(key);
    
    const timerId = setTimeout(callback, delay);
    this.timers.set(key, timerId);
  }
  
  /**
   * 清除指定定时器
   * @param key 定时器唯一标识
   */
  clearInterval(key: string): void {
    const timerId = this.timers.get(key);
    if (timerId !== undefined) {
      clearInterval(timerId);
      this.timers.delete(key);
    }
  }
  
  /**
   * 清除指定延时器
   * @param key 定时器唯一标识
   */
  clearTimeout(key: string): void {
    const timerId = this.timers.get(key);
    if (timerId !== undefined) {
      clearTimeout(timerId);
      this.timers.delete(key);
    }
  }
  
  /**
   * 清除所有定时器
   */
  clearAll(): void {
    const entries = Array.from(this.timers.entries());
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const timerId = entry[1];
      clearInterval(timerId);
      clearTimeout(timerId);
    }
    this.timers.clear();
  }
  
  /**
   * 获取当前定时器数量
   * @returns 定时器数量
   */
  getTimerCount(): number {
    return this.timers.size;
  }
}

/**
 * 防抖函数
 * @param func 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce(func: Function, delay: number): Function {
  let timerId: number = -1;
  
  return function(...args: Object[]) {
    if (timerId !== -1) {
      clearTimeout(timerId);
    }
    
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param func 要执行的函数
 * @param interval 间隔时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle(func: Function, interval: number): Function {
  let lastTime: number = 0;
  
  return function(...args: Object[]) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      func(...args);
      lastTime = now;
    }
  };
}

