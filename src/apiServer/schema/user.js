const joi = require('@hapi/joi')
 /**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

 // 用户名的验证规则
 const userName = joi.string().alphanum().min(1).max(11).required()
 // 密码的验证规则
 const password = joi.string().pattern(/^[\S]{6,12}$/).required()

 // 表单校验规则对象
 exports.regLoginSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
   userName,
   password,
  },
 }