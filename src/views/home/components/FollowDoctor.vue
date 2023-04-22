<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
</script>

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
      <van-swipe :width="150" :show-indicators="false" :loop="false">
        <van-swipe-item v-for="item in 6" :key="item">
          <doctor-card />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

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
