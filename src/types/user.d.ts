/**
 * 用户相关的ts类型
 */
export type User = {
  token: string
  id: string
  account: string
  mobile: string
  avatar: string
  refreshToken: string
}

export type CodeType = 'login' | 'register'

export interface data {
  code: string
}
type OmitUser = Omit<User, 'token'>
export type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}

// 患者信息

export interface Patient {
  /**
   * 年龄
   */
  age?: number
  /**
   * 是否设置为默认患者 0不是默认 1是默认患者
   */
  defaultFlag: 0 | 1
  /**
   * 性别 1男 0女
   */
  gender: number
  id?: string
  /**
   * 患者身份证号
   */
  idCard: string
  /**
   * 患者姓名
   */
  name: string
}

// 患者列表信息
export type PatientList = Patient[]
