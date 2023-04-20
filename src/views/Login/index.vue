<template>
  <cp-nav-bar title="登录" rightText="注册" @click-right="clickRight"></cp-nav-bar>
  <div class="login">
    <div class="login-head">
      <h3>{{ isPassword ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPassword = !isPassword">
        <span>{{ isPassword ? '短信验证码登录' : '密码码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- == form 表单 == -->
    <van-form @submit="login" autocomplete="off">
      <van-field
        :rules="mobileRules"
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="number"
      ></van-field>
      <!--密码-->
      <van-field
        v-if="isPassword"
        :rules="passwordRules"
        placeholder=" 请输入密码 "
        v-model="password"
        :type="`${isShowPass ? 'text' : 'password'}`"
      >
        <template #right-icon>
          <cp-icon
            @click="isShowPass = !isShowPass"
            :name="`login-eye-${isShowPass ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <!--短信验证码-->
      <van-field
        v-else
        placeholder="短信验证码"
        :rules="codewordRules"
        v-model="codeword"
        type="number"
        maxlength="6"
      >
        <template #button>
          <span :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `	${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <!--用户协议-->
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <!--登录按钮-->
      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:">忘记密码？</a>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { mobileRules, passwordRules, codewordRules } from '@/utils/rules'
import { loginByPassword, sendMobileCode, loginByMobile } from '@/api/user'
import { ref, onUnmounted } from 'vue'
import { showFailToast, showSuccessToast, type FormInstance } from 'vant'
import { useUserStore } from '@/stores/modules/user'
import { useRouter, useRoute } from 'vue-router'

const clickRight = () => {
  console.log('clickRight')
}
const agree = ref(false)
const isShowPass = ref(false)
// 手机号
const mobile = ref('')
// 密码
const password = ref('')
// 验证码
const codeword = ref('')
// 定时器计数
const time = ref(0)
// 通过使用FormInstance类型可以获取form组件实例
const form = ref<FormInstance>()
// store仓库
const store = useUserStore()
// 跳转页面使用
const router = useRouter()
// 获取路由参数使用
const route = useRoute()
// 控制密码登录还是验证码登录
const isPassword = ref(true)
// 定时器的id
let timeId: number
// 发送验证码
const send = async () => {
  // time值大于0，60秒内不能再发送验证码，直接return
  if (time.value > 0) return
  // 获取form实例，使用validate方法校验手机号格式是否正确
  await form.value?.validate('mobile')
  // 校验通过，调用接口发送请求获取验证码
  const { data } = await sendMobileCode(mobile.value, 'login')
  codeword.value = data.code
  // 消息提示
  showSuccessToast('发送成功')
  time.value = 60
  timeId = setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}
// 组件撤销时，清除定时器
onUnmounted(() => {
  window.clearInterval(timeId)
})
// 登录方法
const login = async () => {
  // 登录逻辑，校验通过之后执行下面的代码
  if (!agree.value) return showFailToast('请勾选协议')
  try {
    // 判断是密码登录还是短信验证码登录，根据isPassword的值调用不同的接口
    const res = isPassword.value
      ? await loginByPassword(mobile.value, password.value)
      : await loginByMobile(mobile.value, codeword.value)
    store.setUser(res.data)
    // 若存在(route.query.returnUrl 就跳转到 returnUrl的地址
    await router.push((route.query.returnUrl as string) || '/user')
    showSuccessToast('登陆成功')
  } catch (e) {
    console.log(e)
  }
}
</script>
<style lang="scss" scoped>
.login {
  padding-top: 46px;

  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;

    h3 {
      font-weight: normal;
      font-size: 24px;
    }

    a {
      font-size: 15px;
    }
  }

  .van-form {
    padding: 0 14px;

    .cp-cell {
      height: 52px;
      padding: 14px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .van-checkbox {
        a {
          color: var(--cp-primary);
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
