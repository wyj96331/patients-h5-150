<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { baseURL } from '@/utils/request'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { MsgType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import { getConsultOrderDetail } from '@/api/onsult'
import type { ConsultOrderItem } from '@/types/consult'
const consult = ref<ConsultOrderItem>()
let socket: Socket
const list = ref<Message[]>([])
const store = useUserStore()
const route = useRoute()
const initSocket = () => {
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  socket.on('connect', () => {
    console.log('连接成功')
  })
  socket.on('error', () => {
    // 错误异常消息
    console.log('error')
  })

  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })
  // 聊天历史记录
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 准备转换常规消息列表
    const arr: Message[] = []
    data.forEach((item) => {
      // 1. 处理消息时间
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      // 2. 其它消息
      arr.push(...item.items)
    })
    // 追加到聊天消息列表
    list.value.push(...arr)
  })
}
const sendText = (text: string) => {
  // 发送信息需要数据：发送人、收消息人、消息类型、消息内容
  socket.emit('sendChatMsg', {
    from: store.user?.id, // 发送人(登录人的id)
    to: consult.value?.docInfo?.id, // 收消息人(接诊的医生)
    msgType: MsgType.MsgText, // 消息类型
    msg: { content: text } // 消息内容
  })
}
const getOrderDetail = async () => {
  const { data } = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = data
}
onMounted(() => {
  initSocket()
  getOrderDetail()
})
onUnmounted(() => {
  // 组件销毁时，关闭连接
  socket.close()
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 1. 问诊状态-->
    <room-status />
    <!-- 2. 问诊聊天列表消息 -->
    <room-message :list="list" />
    <!-- 3. 底部操作栏：发消息 -->
    <room-action @send-text="sendText" />
  </div>
</template>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
