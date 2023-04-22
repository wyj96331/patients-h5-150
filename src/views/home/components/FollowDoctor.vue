<template>
  <div class="follow-doctor">
    <!--      className="head" 头部-->
    <div class="head">
      <p>推荐关注</p>
      <a href="javascript:"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <!--      医生列表-->
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe :width="(150 / 375) * width" :show-indicators="false" :loop="false">
        <van-swipe-item v-for="item in list" :key="item.id">
          <doctor-card :item="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DoctorPage } from '@/types/consult'
import { getDoctorPage } from '@/api/onsult'
import DoctorCard from './DoctorCard.vue'
// 原生js实时获取屏幕宽度
import { ref, onMounted } from 'vue'
// 初始值 设置为375
const width = ref(375)
const list = ref<DoctorPage>([])
const pageParams = {
  current: 1,
  pageSize: 5
}
onMounted(() => {
  width.value = window.innerWidth
  window.addEventListener('resize', () => {
    width.value = window.innerWidth
  })
  getDoctorList()
})
const getDoctorList = async () => {
  const res = await getDoctorPage(pageParams)
  list.value = res.data.rows
}
</script>
<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  // height: 250px;
  padding-bottom: 20px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
