<script setup lang="ts">
import { ref } from 'vue'
import { showLoadingToast } from 'vant'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import type { Image } from '@/types/consult'
import { uploadImage } from '@/api/onsult'
const text = ref('')
const emit = defineEmits<{
  (e: 'send-text', data: string): void
  (e: 'send-image', img: Image): void
}>()
const sendText = async () => {
  await emit('send-text', text.value)
  text.value = ''
}
const sendImage: UploaderAfterRead = async (data) => {
  // 排除多图上传数组情况
  if (Array.isArray(data)) return
  // 排除不存在情况
  if (!data.file) return
  const t = showLoadingToast({
    message: '正在上传',
    duration: 0 // 设置为0不会自动关闭
  })
  const { data: img } = await uploadImage(data.file)
  // 关闭提示
  t.close()
  emit('send-image', img)
}

// 发消息输入框是否可用
defineProps<{
  disabled: boolean
}>()
</script>

<template>
  <div class="room-action">
    <van-field
      :disabled="disabled"
      v-model="text"
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      @keyup.enter="sendText"
    ></van-field>
    <van-uploader :after-read="sendImage" :disabled="disabled" :preview-image="false">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
