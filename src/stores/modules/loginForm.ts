// 登录表单状态管理
import { defineStore } from 'pinia';

type LoginFormType = 'AccountPassword' | 'VerificationCode' | 'RegistrationForm';

export const useLoginFormStore = defineStore('loginForm', () => {
  const LoginFormType = ref<LoginFormType>('AccountPassword');

  // 设置登录表单类型
  const setLoginFormType = (type: LoginFormType) => {
    LoginFormType.value = type;
  };

  return {
    LoginFormType,
    setLoginFormType,
  };
});
