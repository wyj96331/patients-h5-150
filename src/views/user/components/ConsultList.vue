<script setup lang="ts">
import ConsultItem from './ConsultItem.vue'
import type { ConsultType } from '@/enums'
import { getConsultOrderList } from '@/api/onsult'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { ref } from 'vue'
const list = ref<ConsultOrderItem[]>([])
const loading = ref(false)
const finished = ref(false)
// 父组件传入的请求类型参数
const props = defineProps<{ type: ConsultType }>()
// 请求参数
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1, // 默认第一页
  pageSize: 5 // 每一页请求五条数据
})
const onLoad = async () => {
  const { data } = await getConsultOrderList(params.value)
  console.log(data)
  list.value.push(...data.rows)
  // 数据请求完成后关闭loading
  loading.value = false
  if (params.value.current < data.pageTotal) {
    // 数据加载完成 当前页数加1
    params.value.current++
  } else {
    // 数据加载完了
    finished.value = true
  }
}
const onDelete = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item v-for="i in list" :key="i.depId" :item="i" @on-delete="onDelete" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
