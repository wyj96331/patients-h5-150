<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const onClickLeft = () => {
  if (props.back) {
    return props.back()
  }
  if (history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}
const props = defineProps<{
  title: string
  rightText?: string | any
  back?: () => void
}>()
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
</script>

<template>
  <van-nav-bar
    left-arrow
    @click-left="onClickLeft"
    fixed
    :title="title"
    :right-text="rightText"
    @click-right="emit('click-right')"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }

    &__text {
      font-size: 15px;
    }
  }
}
</style>
