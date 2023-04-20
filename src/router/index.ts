import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import routes from './routes'
// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach((to, from) => {
  // 给页面动态添加标题
  document.title = `问诊-${to.meta.title}` || 'app'
  const store = useUserStore()
  // 没有token 同时 要跳转的页面 没有再便名单里，则跳转到登录页
  if (!store.user.token && !['/login'].includes(to.path)) return '/login'
  // 否则不做任何处理
})
// 导出路由实例
export default router
