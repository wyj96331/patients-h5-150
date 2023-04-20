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
