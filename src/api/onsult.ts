import { request } from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  PageParams,
  DoctorPage,
  FollowType
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
