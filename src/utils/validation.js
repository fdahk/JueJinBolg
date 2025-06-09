/**
 * - 被 profileSetting.vue 组件导入使用
 * - 配合 API 层进行数据验证
 * - 与错误提示系统配合显示验证结果
 * - 使用 ES6 模块导入导出语法
 * - 采用对象和类的组合模式
 */

/**
 * - 为验证函数提供配置参数
 * - 与 UI 组件的限制保持一致
 */
// 规则对象
export const VALIDATION_RULES = {
  // 用户名验证规则配置
  USERNAME: {
    MIN_LENGTH: 2,    // 最小长度限制
    MAX_LENGTH: 20,   // 最大长度限制
    REQUIRED: true    // 是否为必填字段
  },
  
  // 职位验证规则配置
  POSITION: {
    MAX_LENGTH: 50,   // 最大长度限制
    REQUIRED: false   // 非必填字段
  },
  
  // 公司验证规则配置
  COMPANY: {
    MAX_LENGTH: 50,   // 最大长度限制
    REQUIRED: false   // 非必填字段
  },
  
  // 个人网址验证规则配置
  WEBSITE: {
    MAX_LENGTH: 100,  // 最大长度限制
    REQUIRED: false   // 非必填字段
  },
  
  // 个人介绍验证规则配置
  INTRODUCTION: {
    MAX_LENGTH: 100,  // 最大长度限制
    REQUIRED: false   // 非必填字段
  }
}

/**
 * 错误消息常量对象
 * - 对象属性可以是字符串或函数
 * - 箭头函数语法 (param) => expression
 * - 为验证函数提供标准化的错误信息
 * - 与 UI 错误显示组件配合
 * - 确保用户看到一致的提示信息
 */
export const ERROR_MESSAGES = {
  REQUIRED: '此字段为必填项',                           // 必填字段错误信息
  MIN_LENGTH: (min) => `至少需要${min}个字符`,          // 最小长度错误信息（函数形式）
  MAX_LENGTH: (max) => `不能超过${max}个字符`,          // 最大长度错误信息（函数形式）
  INVALID_URL: '请输入有效的网址格式',                  // URL格式错误信息
  INVALID_DATE: '请选择有效的日期',                     // 日期格式错误信息
  DATE_TOO_LATE: '日期不能晚于当前时间',               // 日期范围错误信息
  CUSTOM: (message) => message                         // 自定义错误信息透传函数
}

/**
 * 管理表单验证错误状态
 * - ES6 class 语法定义类
 * - constructor 构造函数初始化实例
 * - this 关键字引用当前实例
 * - Object.values() 获取对象所有值
 * - Object.keys() 获取对象所有键
 * - Array.some() 检查是否有元素满足条件
 * - Array.forEach() 遍历数组元素
 * 
 * - 可在组件中实例化使用
 * - 与表单验证函数配合工作
 * - 为错误显示提供数据源
 */
export class Validator {
  constructor() {
    this.errors = {}  // 初始化错误信息存储对象
  }
  
  /**
   * 设置字段的错误信息
   * - 覆盖已存在的错误信息
   * - 被验证函数调用设置错误
   * - 触发 Vue 响应式更新
   * 
   * @param {string} field - 字段名称
   * @param {string} message - 错误信息文本
   */
  setError(field, message) {
    this.errors[field] = message
  }
  
  /**
   * - 清空指定字段的错误状态
   * - 用于用户修正输入后的状态重置
   * - 在用户重新输入时调用
   * - 配合实时验证逻辑
   * 
   * @param {string} field - 要清除错误的字段名
   */
  clearError(field) {
    this.errors[field] = ''
  }
  
  /**
   * 获取指定字段的错误信息
   * - 逻辑或运算符 || 提供默认值
   * - 属性访问可能返回 undefined
   * 
   * - 安全地获取错误信息
   * - 不存在时返回空字符串
   * - 为 UI 组件提供错误信息
   * - 用于条件渲染错误提示
   * 
   * @param {string} field - 字段名称
   * @returns {string} 错误信息，没有错误时返回空字符串
   */
  getError(field) {
    return this.errors[field] || ''
  }
  
  /**
   * 检查是否存在任何验证错误
   * - Object.values() 获取对象所有值的数组
   * - Array.some() 检查是否至少有一个元素满足条件
   * - 箭头函数作为回调函数
   * - 字符串 trim() 去除空白字符
   * - 全局错误状态检查
   * - 忽略空白字符的错误信息
   * - 用于表单提交前的最终验证
   * - 控制提交按钮的可用状态
   * 
   * @returns {boolean} 如果存在错误返回 true，否则返回 false
   */
  hasErrors() {
    return Object.values(this.errors).some(error => error.trim() !== '')
  }
  
  /**
   * 清除所有字段的错误信息
   * - Object.keys() 获取对象所有键的数组
   * - 箭头函数简化回调函数写法
   * 
   * - 批量清理所有错误状态
   * - 用于表单重置或重新验证
   * - 在表单重置时调用
   * - 配合表单初始化逻辑
   */
  clearAllErrors() {
    Object.keys(this.errors).forEach(key => {
      this.errors[key] = ''
    })
  }
}

/**
 * 通用验证函数
 */
export const ValidationUtils = {
  /**
   * 验证必填字段
   * @param {any} value 值
   * @returns {boolean} 是否有效
   */
  required(value) {
    if (typeof value === 'string') {
      return value.trim() !== ''
    }
    return value !== null && value !== undefined && value !== ''
  },
  
  /**
   * 验证最小长度
   * @param {string} value 值
   * @param {number} min 最小长度
   * @returns {boolean} 是否有效
   */
  minLength(value, min) {
    if (!value) return true // 如果为空，让required规则处理
    return value.trim().length >= min
  },
  
  /**
   * 验证最大长度
   * @param {string} value 值
   * @param {number} max 最大长度
   * @returns {boolean} 是否有效
   */
  maxLength(value, max) {
    if (!value) return true
    return value.length <= max
  },
  
  /**
   * 验证URL格式
   * @param {string} value URL值
   * @returns {boolean} 是否有效
   */
  isValidUrl(value) {
    if (!value || !value.trim()) return true // 空值允许通过
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
    return urlPattern.test(value.trim())
  },
  
  /**
   * 验证日期是否不晚于当前时间
   * @param {string} value 日期值
   * @returns {boolean} 是否有效
   */
  isNotFutureDate(value) {
    if (!value) return true
    const selectedDate = new Date(value)
    const currentDate = new Date()
    return selectedDate <= currentDate
  },
  
  /**
   * 验证用户名
   * @param {string} value 用户名
   * @returns {object} 验证结果 {isValid: boolean, message: string}
   */
  validateUserName(value) {
    if (!this.required(value)) {
      return { isValid: false, message: '请填写用户名' }
    }
    
    if (!this.minLength(value, VALIDATION_RULES.USERNAME.MIN_LENGTH)) {
      return { 
        isValid: false, 
        message: ERROR_MESSAGES.MIN_LENGTH(VALIDATION_RULES.USERNAME.MIN_LENGTH) 
      }
    }
    
    if (!this.maxLength(value, VALIDATION_RULES.USERNAME.MAX_LENGTH)) {
      return { 
        isValid: false, 
        message: ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.USERNAME.MAX_LENGTH) 
      }
    }
    
    return { isValid: true, message: '' }
  },
  
  /**
   * 验证工作开始日期
   * @param {string} value 日期值
   * @returns {object} 验证结果
   */
  validateStartWorkDate(value) {
    if (!this.required(value)) {
      return { isValid: false, message: '请选择开始工作时间' }
    }
    
    if (!this.isNotFutureDate(value)) {
      return { isValid: false, message: '开始工作时间不能晚于当前时间' }
    }
    
    return { isValid: true, message: '' }
  },
  
  /**
   * 验证职业方向
   * @param {string} value 职业方向
   * @returns {object} 验证结果
   */
  validateProfession(value) {
    if (!this.required(value)) {
      return { isValid: false, message: '请选择职业方向' }
    }
    
    return { isValid: true, message: '' }
  },
  
  /**
   * 验证可选文本字段
   * @param {string} value 值
   * @param {number} maxLength 最大长度
   * @param {string} fieldName 字段名称
   * @returns {object} 验证结果
   */
  validateOptionalText(value, maxLength, fieldName) {
    if (!this.maxLength(value, maxLength)) {
      return { 
        isValid: false, 
        message: `${fieldName}不能超过${maxLength}个字符` 
      }
    }
    
    return { isValid: true, message: '' }
  },
  
  /**
   * 验证网址
   * @param {string} value 网址值
   * @returns {object} 验证结果
   */
  validateWebsite(value) {
    if (!this.maxLength(value, VALIDATION_RULES.WEBSITE.MAX_LENGTH)) {
      return { 
        isValid: false, 
        message: ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.WEBSITE.MAX_LENGTH) 
      }
    }
    
    if (!this.isValidUrl(value)) {
      return { isValid: false, message: ERROR_MESSAGES.INVALID_URL }
    }
    
    return { isValid: true, message: '' }
  }
}

/**
 * 创建表单验证器实例
 * @param {Array} fields 需要验证的字段列表
 * @returns {Validator} 验证器实例
 */
export function createValidator(fields = []) {
  const validator = new Validator()
  
  // 初始化错误状态
  fields.forEach(field => {
    validator.errors[field] = ''
  })
  
  return validator
}

// 导出默认实例
export default ValidationUtils 