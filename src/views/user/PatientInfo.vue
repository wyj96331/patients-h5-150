<template>
  <div class="patient-page">
    <!--      导航栏-->
    <cp-nav-bar title="家庭档案" />
    <!-- 头部选择提示 -->
    <div class="patient-change" v-if="false">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <!--      患者列表-->
    <div class="patient-list">
      <div class="patient-item" v-for="item in patientList" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2') }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}</span>
        </div>
        <div class="icon"><cp-icon name="user-edit" @click="showPopup(item)" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <!--        添加患者-->
      <div class="patient-add" v-if="patientList.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 患者选择下一步 -->
    <div class="patient-next" v-if="false">
      <van-button type="primary" round block>下一步</van-button>
    </div>
    <!-- 侧边栏 -->
    <van-popup v-model:show="show" position="right">
      <cp-nav-bar
        :title="patient.id ? '修改患者信息' : '增加患者信息'"
        @click-right="submit"
        right-text="保存"
        :back="closePopup"
      ></cp-nav-bar>
      <!-- 表单 -->
      <van-form autocomplete="off">
        <van-field
          v-model="patient.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
          @input="handelInput"
        />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn v-model="patient.gender" :options="options"></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox round v-model="defaultFlag" />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="patient.id">
        <van-action-bar-button
          @click="deletePatient(patient.id)"
          type="danger"
          text="删除"
        ></van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>
<script setup lang="ts">
// 引入身份证校验库
import Validator from 'id-validator'
import { addPatient, getPatientList, editPatient, delPatient } from '@/api/user'
import type { PatientList, Patient, Options } from '@/types/user'
import { ref, onMounted, computed } from 'vue'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
const defualtPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
// 身份证校验实例
const validate = new Validator()
const patient = ref<Patient>({ ...defualtPatient })
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
  }
})
const options: Options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
// 2. 打开侧滑栏
const show = ref(false)
const showPopup = (item?: Patient) => {
  // 有item参数，编辑状态
  if (item) {
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    // 无item参数，添加状态
    // 重置表单数据
    patient.value = { ...defualtPatient }
  }
  show.value = true
}
const closePopup = () => {
  show.value = false
}
const patientList = ref<PatientList>([])
const getPatients = async () => {
  const { data } = await getPatientList()
  patientList.value = data
}
// 提交添加/编辑表单
const submit = async () => {
  // 1.校验患者的名字和身份证
  if (!patient.value.name) return showFailToast('用户名字不能为空')
  if (!patient.value.idCard) return showFailToast('用户身的份证号码不能为空')
  if (!validate.isValid(patient.value.idCard)) return showFailToast('身份证格式错误')
  const { sex } = validate.getInfo(patient.value.idCard)
  if (patient.value.gender !== sex) return showFailToast('性别不符合')
  // 2.校验通过 调用api增加数据
  try {
    patient.value.id ? await editPatient(patient.value) : await addPatient(patient.value)
    closePopup()
    showSuccessToast(patient.value.id ? '修改成功' : '添加成功')
    await getPatients()
  } catch (e) {
    console.log(e)
  }
}
// 删除患者信息
const deletePatient = async (id: string) => {
  await showConfirmDialog({
    title: '提示',
    message: '确定删除此患者？'
  })
  await delPatient(id)
  showSuccessToast('删除成功')
  closePopup()
  await getPatients()
}
// 正则替换，让输入的内容只能是文中，输入其他的不显示
const handelInput = (e: any) => {
  const input = e.target.value
  patient.value.name = input.replace(/[^a-zA-Z\u4E00-\u9FA5]/g, '')
}
onMounted(() => {
  getPatients()
})
</script>
<style lang="scss" scoped>
.van-form {
  height: 100%;
  padding-top: 40px;
  padding-left: 20px;
}
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
    }
  }
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
