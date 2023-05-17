<template>
  <!-- 支付弹层 -->
  <van-action-sheet
    :show="show"
    :closeable="false"
    @update:show="emit('update:show', $event)"
    :before-close="onClose"
    title="选择支付方式"
    :close-on-popstate="false"
  >
    <div class="pay-type">
      <p class="amount">￥{{ actualPayment.toFixed(2) }}</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="paymentMethod = 0">
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付" @click="paymentMethod = 1">
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button @click="payOrder" type="primary" round block>立即支付</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<script setup lang="ts">
import { getConsultOrderPayUrl } from '@/api/onsult'
import { showFailToast, showSuccessToast } from 'vant'
import { ref } from 'vue'
// 支付方式
const paymentMethod = ref<0 | 1>()
const { orderId, show } = defineProps<{
  orderId: string
  actualPayment?: number
  onClose?: () => void
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
}>()
// 跳转支付
const payOrder = async () => {
  if (paymentMethod.value === undefined) showFailToast('请选择支付方式')
  showSuccessToast('跳转支付')
  const { data } = await getConsultOrderPayUrl({
    orderId: orderId,
    paymentMethod: paymentMethod.value!,
    payCallback: 'http://localhost:5173/room'
  })
  window.location.href = data.payUrl
}
</script>

<style lang="scss" scoped>
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
