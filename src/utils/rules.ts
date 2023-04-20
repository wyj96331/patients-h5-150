// 表单校验
const mobileRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
]

const passwordRules = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码需8-24个字符' }
]

const codewordRules = [
  { required: true, message: '请输入6位数验证码' },
  { pattern: /^\d{6}$/, message: '验证码需6个字符' }
]
export { mobileRules, passwordRules, codewordRules }
