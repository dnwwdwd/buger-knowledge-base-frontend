import { defineStore } from 'pinia';

// 权限状态管理
export const useAuthStore = defineStore('auth', () => {
  // 权限菜单列表
  const authMenuList = ref<any[]>([]);

  // 请求权限菜单列表
  const requestAuthMenuList = async () => {
    // const res = await initDynamicRouter();
    authMenuList.value = [];
  };

  return {
    authMenuList,
    requestAuthMenuList,
  };
});
