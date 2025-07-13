<script setup lang="ts">
import { useRouter } from 'vue-router';
import { HOME_URL } from '@/config/index.ts';

// 路由跳转
const router = useRouter();

function handleHomePage() {
  router.push({ path: HOME_URL });
}
</script>

<template>
  <div id="box">
    <div id="banner" class="elx-top" />
    <div class="elx-bottom">
      <div class="elx-text1">
        403
      </div>
      <div class="elx-text2">
        对不起，您没有权限访问
      </div>
      <div class="h-20px" />
      <el-button type="primary" plain @click="handleHomePage">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#box {
  overflow: hidden;
}
#banner {
  margin-top: 60px;
  background: url("@/assets/images/error/403.png") no-repeat;
  background-size: 100%;
}
.elx-top {
  width: 600px;
  height: 400px;
  margin: 0 auto;
}
.elx-bottom {
  height: 300px;
  margin-top: 20px;
  text-align: center;
}
.elx-text1 {
  font-size: 46px;
  font-weight: bold;
}
.elx-text2 {
  padding-top: 30px;
  font-family: YouYuan;
  font-size: 24px;
  font-weight: 600;
}
</style>
