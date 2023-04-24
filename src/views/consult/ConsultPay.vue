<template>
  <div class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <!-- 1. 支付信息 -->
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo?.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo?.pointDeduction}`" />
      <van-cell title="实付款" :value="`-¥${payInfo?.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <!-- 2. 患者信息  -->
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patientInfo?.name} | ${patientInfo?.genderValue} | ${patientInfo?.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 3. 打开支付弹层并创建问诊订单 -->
    <van-submit-bar
      button-type="primary"
      :price="payInfo?.actualPayment! * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
    />
    <!-- 支付弹层 -->
    <van-action-sheet
      :closeable="false"
      :before-close="onClose"
      v-model:show="show"
      title="选择支付方式"
      :close-on-popstate="false"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo?.actualPayment.toFixed(2) }}</p>
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
  </div>
</template>
<script setup lang="ts">
// 获取预支付订单信息
import { getConsultOrderPre, createConsultOrder, getConsultOrderPayUrl } from '@/api/onsult'
// 患者的详情信息
import { getPatientDetail } from '@/api/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { ref, onMounted } from 'vue'
import { showFailToast, showConfirmDialog, showSuccessToast } from 'vant'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
const router = useRouter()
// 订单id
const orderId = ref<any>()
// 控制支付弹窗
const agree = ref(false)
const show = ref(false)
// 支付方式
const paymentMethod = ref<0 | 1>()
const store = useConsultStore()
// 1.定义一个预支付订单信息便令
const payInfo = ref<ConsultOrderPreData>()
// 2.获取预支付订单信息
const getPayData = async () => {
  try {
    const res = await getConsultOrderPre({
      type: store.consult.type,
      illnessType: store.consult.illnessType
    })
    payInfo.value = res.data
    // 设置默认优惠券
    store.setCunpon(payInfo.value.couponId)
  } catch (e) {
    showFailToast('缺少必要的问诊信息，请重新选择')
    await router.push('/')
  }
}
// 3.获取患者详情信息
const patientInfo = ref<Patient>()
const getPatientInfo = async () => {
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  patientInfo.value = res.data
}
onMounted(() => {
  getPayData()
  getPatientInfo()
})
const submit = async () => {
  if (!store.consult.type) return showFailToast('请选择就医类型')
  if (!agree.value) return showFailToast('请勾选我已同意支付协议')

  // 调用接口，创建订单
  try {
    const { data } = await createConsultOrder(store.consult)
    // 打开 支付窗口
    show.value = true
    orderId.value = data
    console.log(orderId)
    // 清空数据
    store.clear()
  } catch (e) {
    console.log(e)
  }
}
// 订单创建成功后
onBeforeRouteLeave(() => {
  if (orderId.value) return false
})
// 关闭提示
const onClose = async () => {
  try {
    await showConfirmDialog({
      title: '关闭支付',
      message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
      cancelButtonText: '仍要关闭',
      confirmButtonText: '继续支付',
      confirmButtonColor: 'var(--cp-primary)'
    })
    return false
  } catch {
    orderId.value = '' // 清空后才能跳转页面
    await router.push('/')
    return true
  }
}
// 跳转支付
const payOrder = async () => {
  if (paymentMethod.value === undefined) showFailToast('请选择支付方式')
  showSuccessToast('跳转支付')
  const res = await getConsultOrderPayUrl({
    orderId: orderId.value.id,
    paymentMethod: paymentMethod.value!,
    payCallback: 'http://localhost/room'
  })
  window.location.href = res.payUrl
}
</script>
<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
  .pay-info {
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
    align-items: center;
    .tit {
      width: 100%;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .img {
      margin-right: 10px;
      width: 38px;
      height: 38px;
      border-radius: 4px;
      overflow: hidden;
    }
    .desc {
      flex: 1;
      > span {
        display: block;
        color: var(--cp-tag);
        &:first-child {
          font-size: 16px;
          color: var(--cp-text2);
        }
      }
    }
  }
  .pay-price {
    ::v-deep() {
      .vam-cell__title {
        font-size: 16px;
      }
      .van-cell__value {
        font-size: 16px;
        color: var(--cp-price);
      }
    }
  }
  .pay-space {
    height: 12px;
    background-color: var(--cp-bg);
  }
  .pay-schema {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: var(--cp-primary);
    }
  }
  ::v-deep() {
    .van-submit-bar__button {
      font-weight: normal;
      width: 160px;
    }
  }
}
// 支付弹层样式
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
