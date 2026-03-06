/**
 * 验证工具类
 * @description 提供各种数据验证方法
 * @since API version 12
 */

import { ValidationRules } from '../constants/AppConstants';

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

/**
 * 验证用户名
 * @param username 用户名
 * @returns 验证结果
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || username.trim().length === 0) {
    return { isValid: false, errorMessage: '用户名不能为空' };
  }
  
  if (username.length < ValidationRules.USERNAME_MIN_LENGTH) {
    return { isValid: false, errorMessage: `用户名至少${ValidationRules.USERNAME_MIN_LENGTH}个字符` };
  }
  
  if (username.length > ValidationRules.USERNAME_MAX_LENGTH) {
    return { isValid: false, errorMessage: `用户名最多${ValidationRules.USERNAME_MAX_LENGTH}个字符` };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, errorMessage: '用户名只能包含字母、数字和下划线' };
  }
  
  return { isValid: true, errorMessage: '' };
}

/**
 * 验证密码
 * @param password 密码
 * @returns 验证结果
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim().length === 0) {
    return { isValid: false, errorMessage: '密码不能为空' };
  }
  
  if (password.length < ValidationRules.PASSWORD_MIN_LENGTH) {
    return { isValid: false, errorMessage: `密码至少${ValidationRules.PASSWORD_MIN_LENGTH}位` };
  }
  
  if (password.length > ValidationRules.PASSWORD_MAX_LENGTH) {
    return { isValid: false, errorMessage: `密码最多${ValidationRules.PASSWORD_MAX_LENGTH}位` };
  }
  
  return { isValid: true, errorMessage: '' };
}

/**
 * 验证邮箱
 * @param email 邮箱地址
 * @returns 验证结果
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, errorMessage: '邮箱不能为空' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, errorMessage: '邮箱格式不正确' };
  }
  
  return { isValid: true, errorMessage: '' };
}

/**
 * 验证手机号
 * @param phone 手机号
 * @returns 验证结果
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { isValid: true, errorMessage: '' }; // 手机号可选
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, errorMessage: '手机号格式不正确' };
  }
  
  return { isValid: true, errorMessage: '' };
}

/**
 * 验证密码确认
 * @param password 密码
 * @param confirmPassword 确认密码
 * @returns 验证结果
 */
export function validatePasswordConfirm(password: string, confirmPassword: string): ValidationResult {
  if (password !== confirmPassword) {
    return { isValid: false, errorMessage: '两次输入的密码不一致' };
  }
  
  return { isValid: true, errorMessage: '' };
}

/**
 * 验证传感器数据范围
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 * @param name 参数名称
 * @returns 验证结果
 */
export function validateSensorRange(value: number, min: number, max: number, name: string): ValidationResult {
  if (value < min || value > max) {
    return { isValid: false, errorMessage: `${name}超出正常范围（${min}-${max}）` };
  }
  
  return { isValid: true, errorMessage: '' };
}

