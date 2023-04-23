import { followDoctor } from '@/api/onsult'
import { ref } from 'vue'
import { showSuccessToast } from 'vant'
import type { FollowType } from '@/types/consult'
const useFollow = (type: FollowType = 'doc') => {
  // 关注逻辑
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    // 防止重复点击
    loading.value = true
    try {
      await followDoctor(item.id, type)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
      // if (item.likeFlag === 1) showSuccessToast('已关注')
      // if (item.likeFlag === 0) showSuccessToast('已取消关注')
      showSuccessToast(item.likeFlag === 1 ? '已关注' : '已取消关注')
    } finally {
      // 无论 try / catch 结果如何都会执行的代码块
      loading.value = false
    }
  }
  return { loading, follow }
}

export { useFollow }
