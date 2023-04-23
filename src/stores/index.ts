/**
 * 创建pinia实例
 */
import { createPinia } from 'pinia'

// 导入pinia数据持久化插件
import piniaPulgin from 'pinia-plugin-persistedstate'

// 1.创建实例
const pinia = createPinia()

// 注册持久化插件
pinia.use(piniaPulgin)

// 2.导出实例
export default pinia

// 在index模块再一次同意导出user模块的变量和方法
export * from './modules/user'
export * from './modules/consult'
