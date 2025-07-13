<!-- 手机号验证码登录表单 -->
<script lang="ts" setup>
// 表单逻辑由用户自行实现
</script>

<template>
  <div class="custom-form">
    <!-- 此处放入用户自己的表单组件 -->
    <div class="form-group">
      <label>手机号</label>
      <input type="text" placeholder="请输入手机号">
    </div>
    <div class="form-group">
      <label>验证码</label>
      <input type="text" placeholder="请输入验证码">
      <button>获取验证码</button>
    </div>
    <button class="login-btn">
      登录
    </button>
  </div>
</template>

<style scoped>
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
