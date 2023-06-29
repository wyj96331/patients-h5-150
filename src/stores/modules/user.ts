import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'
export const useUserStore = defineStore(
  'patients-user',
  () => {
    // 全局变量：user 用户信息
    // 空对象的变量通过 as 断言类型的变量
    const user = ref({} as User)

    // 方法：
    /**
     * setUser 存储用户信息
     * @param userData
     */
    const setUser = (userData: User) => {
      user.value = userData
    }
    /**
     * deleteUser 删除用户信息
     */
    const deleteUser = () => {
      user.value = {} as User
    }

    /**
     * 返回变量和方法
     */
    return {
      user,
      setUser,
      deleteUser
    }
  },
  {
    // 开启数据持久化
    persist: {
      key: 'patients-h5',
      paths: ['user'] // 数组内变量会持久化
    }
  }
)
