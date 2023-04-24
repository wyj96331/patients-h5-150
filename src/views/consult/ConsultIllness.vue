<script setup lang="ts">
// 患病时间选项
import { ref } from 'vue'
import type { ConsultIllness, Image } from '@/types/consult'
// 有赞提供的类型
import type { UploaderAfterRead, UploaderFileListItem } from 'vant/lib/uploader/types'
import { uploadImage } from '@/api/onsult'
const fileList = ref<Image[]>([])
const timeOptions = [
  { label: '一周内', value: 1 },
  { label: '一月内', value: 2 },
  { label: '半年内', value: 3 },
  { label: '大于半年', value: 4 }
]
// 是否就诊选项
const flagOptions = [
  { label: '就诊过', value: 0 },
  { label: '没就诊过', value: 1 }
]
const form = ref<ConsultIllness>({
  illnessTime: undefined,
  illnessDesc: '',
  consultFlag: undefined,
  pictures: []
})
// 上传图片
const onAfterRead: UploaderAfterRead = async (item) => {
  // 1.排除数组和空值的情况
  if (Array.isArray(item)) return
  if (!item.file) return
  // 2.调接口,上传图片
  // 上传消息提示
  item.status = 'uploading'
  item.message = '上传中。。。。'
  try {
    const data = await uploadImage(item.file)
    item.status = 'done'
    item.message = undefined
    // 添加url，删除时可以根据url删除
    item.url = data.url
    // 存储上传成功图片url
    form.value.pictures?.push(data)
  } catch {
    item.status = 'failed'
    item.message = '上传失败。。。'
  }
}
// 删除已经上传的图片
const onDeleteImg = (item: UploaderFileListItem) => {
  form.value.pictures = form.value.pictures?.filter((subTtem) => subTtem.url !== item.url)
}
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 1. 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 2. 病情描述-表单 -->
    <div class="illness-form">
      <!-- 病情描述-基本情况 -->
      <van-field
        v-model="form.illnessDesc"
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn v-model="form.illnessTime" :options="timeOptions" />
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn v-model="form.consultFlag" :options="flagOptions" />
      </div>
      <!-- 病情描述-图片上传 -->
      <div class="illness-img">
        <van-uploader
          upload-icon="photo-o"
          upload-text="上传图片"
          max-count="9"
          :max-size="5 * 1024 * 1024"
          v-model="fileList"
          :after-read="onAfterRead"
          @delete="onDeleteImg"
        ></van-uploader>
        <p class="tip">上传内容仅医生可见,最多9张图,最大5MB</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>
