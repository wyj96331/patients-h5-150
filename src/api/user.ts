import { request } from '@/utils/request'
import type { CodeType, User, data, UserInfo } from '@/types/user'
/**
 * 密码登录接口
 * @param mobile
 * @param password
 */
export const loginByPassword = (mobile: string, password: string) =>
  // post方法的返回值为User类
  request.post<User>('/login/password', { mobile, password })

/**
 * 获取短信验证码
 * @param mobile
 * @param type
 */
export const sendMobileCode = (mobile: string, type: CodeType) =>
  // data 定义get函数的返回值类型
  request.get<data>('/code', { params: { mobile, type } })

/**
 * 短信登录
 * @param mobile
 * @param code
 */
export const loginByMobile = (mobile: string, code: string) =>
  request.post<User>('/login', { mobile, code })

/**
 * 获取个人资料
 */
export const getUserInfo = () => request.get<UserInfo>('/patient/myUser')
