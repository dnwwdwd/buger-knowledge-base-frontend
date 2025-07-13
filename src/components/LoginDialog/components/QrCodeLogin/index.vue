<script lang="ts" setup>
import { Check, Picture as IconPicture, Refresh } from '@element-plus/icons-vue';
import { useCountdown } from '@vueuse/core';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';

// 响应式状态
const urlText = shallowRef('');
const qrCodeUrl = useQRCode(urlText);
const isExpired = ref(false);
const isScanned = ref(false); // 新增：是否已扫码
const isConfirming = ref(false); // 新增：是否进入确认登录阶段
const confirmCountdownSeconds = shallowRef(180); // 确认登录倒计时（3分钟）

// 二维码倒计时实例
const { start: qrStart, stop: qrStop } = useCountdown(shallowRef(60), {
  interval: 1000,
  onComplete: () => {
    isExpired.value = true;
    stopPolling(); // 二维码过期时停止轮询
  },
});

// 确认登录倒计时实例
const { start: confirmStart, stop: confirmStop } = useCountdown(confirmCountdownSeconds, {
  interval: 1000,
  onComplete: () => {
    isExpired.value = true;
    isConfirming.value = false;
    stopPolling(); // 确认倒计时结束时停止轮询
  },
});

// 轮询相关
let scanPolling: number | null = null;
let confirmPolling: number | null = null;

// 模拟后端接口 这里返回新的二维码地址
async function fetchNewQRCode() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return `https://login-api.com/qr/${Date.now()}`;
}
// 模拟后端接口 这里返回是否已扫码
async function checkScanStatus() {
  // 模拟扫码状态接口（实际应调用后端接口）
  await new Promise(resolve => setTimeout(resolve, 300));
  return Math.random() > 0.3; // 30%概率未扫码，70%概率已扫码
}

// 模拟后端接口 这里返回扫码后是否已确认
async function checkConfirmStatus() {
  // 模拟确认登录接口（实际应调用后端接口）
  await new Promise(resolve => setTimeout(resolve, 200));
  return Math.random() > 0.5; // 50%概率已确认
}

// 模拟登录逻辑 如果在客户端已确认，则会调用这个方法进行登录
async function mockLogin() {
  // 模拟登录成功逻辑
  console.log('模拟调用登录接口...');
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('模拟调用登录成功...');
}

/** 停止所有轮询 */
function stopPolling() {
  if (scanPolling)
    clearInterval(scanPolling);
  if (confirmPolling)
    clearInterval(confirmPolling);
  scanPolling = null;
  confirmPolling = null;
}

/** 刷新二维码 */
async function handleRefresh() {
  isExpired.value = false;
  isScanned.value = false;
  isConfirming.value = false;
  stopPolling();
  qrStart(shallowRef(60));
  const newUrl = await fetchNewQRCode();
  urlText.value = newUrl;
}

/** 启动扫码状态轮询 */
function startScanPolling() {
  scanPolling = setInterval(async () => {
    if (!isExpired.value && !isScanned.value) {
      const scanned = await checkScanStatus();
      if (scanned) {
        isScanned.value = true;
        isConfirming.value = true;
        confirmStart(confirmCountdownSeconds); // 启动确认倒计时
        startConfirmPolling(); // 开始确认登录轮询
        stopPolling(); // 停止扫码轮询
      }
    }
  }, 2000); // 每2秒轮询一次
}

/** 启动确认登录轮询 */
function startConfirmPolling() {
  confirmPolling = setInterval(async () => {
    if (isConfirming.value && !isExpired.value) {
      const confirmed = await checkConfirmStatus();
      if (confirmed) {
        stopPolling();
        confirmStop();
        await mockLogin();
        handleRefresh(); // 登录成功后刷新二维码
      }
    }
  }, 2000); // 每2秒轮询一次
}

/** 组件初始化 */
onMounted(async () => {
  const initialUrl = await fetchNewQRCode();
  urlText.value = initialUrl;
  qrStart();
  startScanPolling(); // 初始启动扫码轮询
});

/** 组件卸载清理 */
onBeforeUnmount(() => {
  qrStop();
  confirmStop();
  stopPolling();
});
</script>

<template>
  <div class="qr-wrapper">
    <div class="tip">
      请使用手机扫码登录
    </div>

    <div class="qr-img-wrapper">
      <el-image v-loading="!qrCodeUrl" :src="qrCodeUrl" alt="登录二维码" class="qr-img">
        <template #error>
          <el-icon><IconPicture /></el-icon>
        </template>
      </el-image>

      <!-- 过期覆盖层 -->
      <div v-if="isExpired" class="expired-overlay" @click.stop="handleRefresh">
        <div class="expired-content">
          <p class="expired-text">
            二维码失效
          </p>
          <el-button class="refresh-btn" link>
            <el-icon><Refresh /></el-icon>
            点击刷新
          </el-button>
        </div>
      </div>

      <!-- 扫码成功覆盖层 -->
      <div v-if="isScanned && !isExpired" class="scanned-overlay">
        <div class="scanned-content">
          <p class="scanned-text">
            <el-icon class="success-icon">
              <Check />
            </el-icon>
            已扫码
          </p>

          <p class="scanned-text">
            请在手机端确认登录
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.qr-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  .tip {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
  .qr-img-wrapper {
    position: relative;
    width: 180px;
    height: 180px;
    padding: 12px;
    overflow: hidden;
    border: 1px solid #f0f2f5;
    border-radius: 16px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 8%);
    .qr-img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      .el-icon {
        font-size: 18px;
        color: #909399;
      }
    }
    .expired-overlay,
    .scanned-overlay {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 16px;
    }
    .expired-overlay {
      cursor: pointer;
      background: hsl(0deg 0% 100% / 95%);
      .expired-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        text-align: center;
        .expired-text {
          font-size: 14px;
          color: #909399;
        }
      }
    }
    .scanned-overlay {
      cursor: default;
      background: hsl(120deg 60% 97% / 95%);
      .scanned-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        .success-icon {
          font-size: 18px;
          color: #67c23a;
        }
        .scanned-text {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 14px;
          color: #606266;
        }
        .countdown-text {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}
</style>
