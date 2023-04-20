<template>
  <div class="layout-page">
    <!--      二级路由挂载点-->
    <router-view></router-view>
    <!--      底部 tabbr组件-->
    <van-tabbar route>
      <van-tabbar-item to="/home">
        首页
        <!--作用域插槽 插入图标icon -->
        <template #icon="{ active }">
          <cp-icon :name="`home-index-${active ? 'active' : 'default'}`"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/article">
        健康百科
        <template #icon="{ active }">
          <cp-icon :name="`home-article-${active ? 'active' : 'default'}`"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/notify">
        消息中心
        <template #icon="{ active }">
          <cp-icon :name="`home-notice-${active ? 'active' : 'default'}`"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/user">
        我的
        <template #icon="{ active }">
          <cp-icon :name="`home-mine-${active ? 'active' : 'default'}`"></cp-icon>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
