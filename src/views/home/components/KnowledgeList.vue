<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <KnowledgeCard v-for="item in list" :key="item.id" :item="item"></KnowledgeCard>
    </van-list>
  </div>
</template>

<script setup lang="ts">
import { getKnowledgePage } from '@/api/onsult'
import KnowledgeCard from './KnowledgeCard.vue'
import { ref } from 'vue'
import type { KnowledgeType, KnowledgeList, KnowledgeParams } from '@/types/consult'
const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)
const props = defineProps<{
  type: KnowledgeType
}>()
// 请求参数
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
const onLoad = async () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  const { data } = await getKnowledgePage(params.value)
  list.value.push(...data.rows)
  // 加载状态结束
  loading.value = false
  // 数据全部加载完成
  if (list.value.length === data.total) {
    finished.value = true
  } else {
    // 数据没有加载完，页面加1
    params.value.current++
  }
}
</script>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
