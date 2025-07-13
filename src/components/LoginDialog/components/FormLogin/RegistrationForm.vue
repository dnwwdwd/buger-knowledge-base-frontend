<!-- 注册表单 -->
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import type { RegisterDTO } from '@/api/auth/types';
import { useCountdown } from '@vueuse/core';
import { reactive, ref } from 'vue';
import { emailCode, register } from '@/api';
import { useLoginFormStore } from '@/stores/modules/loginForm';

const loginFromStore = useLoginFormStore();
const countdown = shallowRef(60);
const { start, stop, resume } = useCountdown(countdown, {
  onComplete() {
    resume();
  },
  onTick() {
    countdown.value--;
  },
});

const formRef = ref<FormInstance>();

const formModel = ref<RegisterDTO>({
  username: '',
  password: '',
  code: '',
  confirmPassword: '',
});

const rules = reactive<FormRules<RegisterDTO>>({
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    {
      validator: (_, value) => {
        if (value !== formModel.value.password) {
          return new Error('两次输入的密码不一致');
        }
        return true;
      },
      trigger: 'change',
    },
  ],
  username: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator: (_, value) => {
        if (!isEmail(value)) {
          return new Error('请输入正确的邮箱');
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
});

function isEmail(email: string) {
  const emailRegex = /^[\w.-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
  return emailRegex.test(email);
}
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    const params: RegisterDTO = {
      username: formModel.value.username,
      password: formModel.value.password,
      code: formModel.value.code,
    };
    await register(params);
    ElMessage.success('注册成功');
    formRef.value?.resetFields();
    resume();
  }
  catch (error) {
    console.error('请求错误:', error);
  }
}

// 获取验证码
async function getEmailCode() {
  if (formModel.value.username === '') {
    ElMessage.error('请输入邮箱');
    return;
  }
  if (!isEmail(formModel.value.username)) {
    return;
  }
  if (countdown.value > 0 && countdown.value < 60) {
    return;
  }
  try {
    start();
    await emailCode({ username: formModel.value.username });
    ElMessage.success('验证码发送成功');
  }
  catch (error) {
    console.error('请求错误:', error);
    stop();
  }
}
</script>

<template>
  <div class="custom-form">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      style="width: 230px"
      @submit.prevent="handleSubmit"
    >
      <el-form-item prop="username">
        <el-input v-model="formModel.username" placeholder="请输入邮箱" autocomplete="off">
          <template #prefix>
            <el-icon>
              <Message />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input v-model="formModel.code" placeholder="请输入验证码" autocomplete="off">
          <template #prefix>
            <el-icon>
              <Bell />
            </el-icon>
          </template>

          <template #suffix>
            <div class="font-size-14px cursor-pointer bg-[var(0,0,0,0.4)]" @click="getEmailCode">
              {{ countdown === 0 || countdown === 60 ? "获取验证码" : `${countdown} s` }}
            </div>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="formModel.password" placeholder="请输入密码" autocomplete="off">
          <template #prefix>
            <el-icon>
              <Unlock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input v-model="formModel.confirmPassword" placeholder="请确认密码" autocomplete="off">
          <template #prefix>
            <el-icon>
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 100%" native-type="submit">
          注册
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 返回登录 -->
    <div class="form-tip font-size-12px flex items-center">
      <span>已有账号，</span>
      <span
        class="c-[var(--el-color-primar,#409eff)] cursor-pointer"
        @click="loginFromStore.setLoginFormType('AccountPassword')"
      >
        返回登录
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
.login-btn {
  padding: 12px;
  margin-top: 24px;
  color: white;
  cursor: pointer;
  background: #409eff;
  border: none;
  border-radius: 4px;
}
</style>
