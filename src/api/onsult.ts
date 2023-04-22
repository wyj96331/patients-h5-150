import { request } from '@/utils/request'
import type { KnowledgeParams, KnowledgePage } from '@/types/consult'
export const getKnowledgePage = (params: KnowledgeParams) =>
  request.get<KnowledgePage>('/patient/home/knowledge', { params })
