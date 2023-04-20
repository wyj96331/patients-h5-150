import { createApp } from 'vue'
import 'vant/es/toast/style'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import 'virtual:svg-icons-register'
// 引入全局样式
import '@/styles/index.scss'
// 创建跟实例
const app = createApp(App)
// 注册pinia和router
app.use(pinia)
app.use(router)

app.mount('#app')
