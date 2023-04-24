import { defineStore } from 'pinia'
import type { PartialConsult } from '@/types/consult'
import { ref } from 'vue'
import type { ConsultType } from '@/enums'
export const useConsultStore = defineStore(
  'patient-consult',
  () => {
    // 1.问诊记录数据
    const consult = ref<PartialConsult>({})
    // 2.首页使用:记录问诊类型
    const setType = (type: ConsultType) => (consult.value.type = type)

    //3.记录问诊级别 问诊级别：0普通  1三甲
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)

    // 4.选择科室页面:记录科室id
    const setDepId = (id: string) => (consult.value.depId = id)
    // 5. 设置病情描述
    const setIllness = (
      illness: Pick<PartialConsult, 'illnessDesc' | 'illnessTime' | 'pictures' | 'consultFlag'>
    ) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 6. 设置患者
    const setPatient = (id: string) => (consult.value.patientId = id)
    // 7. 设置优惠券
    const setCunpon = (id?: string) => (consult.value.couponId = id)
    // 8. 清空记录
    const clear = () => (consult.value = {})

    return {
      consult,
      setType,
      setIllnessType,
      setDepId,
      setIllness,
      setPatient,
      setCunpon,
      clear
    }
  },
  {
    // 开启数据持久化
    persist: {
      key: 'patients-consult'
    }
  }
)
