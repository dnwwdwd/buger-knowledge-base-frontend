import type { LoginUser } from '@/api/auth/types';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>();
    const router = useRouter();
    const setToken = (value: string) => {
      token.value = value;
    };
    const clearToken = () => {
      token.value = void 0;
    };

    const userInfo = ref<LoginUser>();
    const setUserInfo = (value: LoginUser) => {
      userInfo.value = value;
    };
    const clearUserInfo = () => {
      userInfo.value = void 0;
    };

    const logout = async () => {
      // 如果需要调用接口，可以在这里调用
      clearToken();
      clearUserInfo();
      router.replace({ name: 'chat' });
    };

    // 新增：登录弹框状态
    const isLoginDialogVisible = ref(false);

    // 新增：打开弹框方法
    const openLoginDialog = () => {
      isLoginDialogVisible.value = true;
    };

    // 新增：关闭弹框方法（可根据需求扩展）
    const closeLoginDialog = () => {
      isLoginDialogVisible.value = false;
    };

    return {
      token,
      setToken,
      clearToken,
      userInfo,
      setUserInfo,
      clearUserInfo,
      logout,
      // 新增：暴露弹框状态和方法
      isLoginDialogVisible,
      openLoginDialog,
      closeLoginDialog,
    };
  },
  {
    persist: true,
  },
);
