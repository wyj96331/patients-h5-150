import { followDoctor, getPrescriptionPic } from '@/api/onsult'
import { onMounted, ref, watch } from 'vue'
import { showFailToast, showImagePreview, showSuccessToast } from 'vant'
import type { FollowType } from '@/types/consult'
import { useClipboard } from '@vueuse/core'
import type { OrderDetail } from '@/types/medicine'
import { getMedicalOrderDetail } from '@/api/medicine'
const { copy, copied, isSupported } = useClipboard()
// 点击关注文章或医生
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
const useLookPre = () => {
  const lookPre = async (id?: string) => {
    if (!id) return
    try {
      const res = await getPrescriptionPic(id)
      // console.log(res)
      showImagePreview([res.data.url])
    } catch (error) {
      console.log(error)
    }
  }
  return {
    lookPre
  }
}
// 复制文本功能
const useCopy = () => {
  const onCopy = (copyText: string) => {
    if (!isSupported.value) showFailToast('未授权，不支持')
    copy(copyText || '')
  }
  // 2. 复制后提示
  watch(copied, () => {
    if (copied.value) showSuccessToast('已复制')
  })
  return {
    onCopy
  }
}
const useMedicineDetil = (id: string) => {
  const order = ref<OrderDetail>()
  onMounted(async () => {
    const { data } = await getMedicalOrderDetail(id)
    order.value = data
    console.log(data)
  })
  return {
    order
  }
}
export { useFollow, useLookPre, useCopy, useMedicineDetil }
