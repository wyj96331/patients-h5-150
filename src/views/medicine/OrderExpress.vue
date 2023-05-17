<script setup lang="ts">
import { getMedicalOrderLogistics } from '@/api/medicine'
import type { Express } from '@/types/medicine'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import carImg from '@/assets/car.png'
import startImg from '@/assets/start.png'
import endImg from '@/assets/end.png'
// 导入高德地图依赖
import AMapLoader from '@amap/amap-jsapi-loader'
// v2.0 需要配置安全密钥jscode
window._AMapSecurityConfig = {
  securityJsCode: '798f5b5b707c2a7cf36149d26671f217'
}
// 1.获取物流信息
const express = ref<Express>()
const route = useRoute()
onMounted(async () => {
  const { data } = await getMedicalOrderLogistics(route.params.id as string)
  express.value = data
  console.log(express)
})
// 2.初始化地图
onMounted(async () => {
  try {
    const AMap = await AMapLoader.load({
      key: 'aa92612f21326e9fb33d957b4f5873de',
      version: '2.0'
    })
    const app = new AMap.Map('map', {
      //设置地图容器id
      zoom: 12, //初始化地图级别
      mapStyle: 'amap://styles/whitesmoke' // 设置地图样式
    })
    // 3.绘制物流轨迹
    AMap.plugin('AMap.Driving', () => {
      const driving = new AMap.Driving({
        map: app, // 指定轨迹显示地图实例
        showTraffic: false,
        hideMarkers: true //关闭路线规划默认 `marker` 标记
      })
      // 开始位置坐标
      const start = express.value?.logisticsInfo.shift()
      // 结束位置坐标
      const end = express.value?.logisticsInfo.pop()
      const road = express.value?.logisticsInfo.map((item) => [item.longitude, item.latitude])
      // 自定义开始结束位置图片
      const startMarker = new AMap.Marker({
        icon: startImg, // 设置自定义图片
        position: [start?.longitude, start?.latitude] // 图片显示的坐标位置
      })
      app.add(startMarker)
      const endMarker = new AMap.Marker({
        icon: endImg,
        position: [end?.longitude, end?.latitude]
      })
      app.add(endMarker)
      driving.search(
        // longitude||latitude 经纬度
        [start?.longitude, start?.latitude],
        [end?.longitude, end?.latitude],
        { waypoints: road },
        (status: string, result: object) => {
          // 未出错时，result即是对应的路线规划方案
          // 绘制运输中货车的当前位置
          const carMarker = new AMap.Marker({
            icon: carImg,
            position: [
              express.value?.currentLocationInfo.longitude,
              express.value?.currentLocationInfo.latitude
            ],
            anchor: 'center' // 设置基于坐标点显示的位置
          })
          app.add(carMarker)
          setTimeout(() => {
            app.setFitView([carMarker])
            app.setZoom(10)
          }, 3000)
        }
      )
    })
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ express?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">{{ express?.statusValue }}——预计{{ express?.estimatedTime }}送达</p>
        <p class="predict">
          <span>{{ express?.name }}</span>
          <span>{{ express?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in express?.list" :key="item.id">
          <p class="status" v-if="item.statusValue">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
