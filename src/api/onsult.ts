import { request } from '@/utils/request'
import type { ConsultOrderPreData, ConsultOrderPreParams, PartialConsult } from '@/types/consult'
import type {
  KnowledgeParams,
  KnowledgePage,
  PageParams,
  DoctorPage,
  FollowType,
  TopDep,
  Image
} from '@/types/consult'
export const getKnowledgePage = (params: KnowledgeParams) =>
  request.get<KnowledgePage>('/patient/home/knowledge', { params })

/**
 * 获取关注医生列表
 * @param params
 */
export const getDoctorPage = (params: PageParams) =>
  request.get<any, DoctorPage>('/home/page/doc', { params })

/**
 * 点击关注
 * @param id
 * @param type
 */
export const followDoctor = (id: string, type: FollowType = 'doc') =>
  request.post('/like', { id, type })

/**
 * 查询所有科室
 */
export const getAllDpe = () => request.get<TopDep[]>('/dep/all')

/**
 * 图片上传
 * @param file
 */
export const uploadImage = (file: File) => {
  const fd = new FormData()
  // 说明：formData对象的key属性值后台定义
  fd.append('file', file)
  console.log(fd)
  return request.post<any, Image>('/upload', fd)
}

/**
 * 预支付订单信息
 * @param params
 */
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request.get<ConsultOrderPreData>('/patient/consult/order/pre', { params })

/**
 * 生成订单
 */

export const createConsultOrder = (data: PartialConsult) =>
  request.post<any, { data: string }>('/patient/consult/order', data)

// 获取支付地址  0 是微信  1 支付宝
export const getConsultOrderPayUrl = (data: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request.post<any, { payUrl: string }>('/patient/consult/pay', data)
