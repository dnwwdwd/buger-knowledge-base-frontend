<!-- LoginBtn 登录按钮 -->
<script setup lang="ts">
import LoginDialog from '@/components/LoginDialog/index.vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const isLoginDialogVisible = computed(() => userStore.isLoginDialogVisible);

// 点击登录按钮时调用Store方法打开弹框
function handleClickLogin() {
  userStore.openLoginDialog();
}
</script>

<template>
  <div class="login-btn-wrapper">
    <div
      class="login-btn bg-#191c1f c-#fff font-size-14px rounded-8px flex-center text-overflow p-10px pl-12px pr-12px min-w-49px h-16px cursor-pointer hover:bg-#232629 select-none"
      @click="handleClickLogin"
    >
      登录
    </div>

    <!-- 登录弹框 -->
    <LoginDialog v-model:visible="isLoginDialogVisible" />
  </div>
</template>

<style scoped lang="scss"></style>
