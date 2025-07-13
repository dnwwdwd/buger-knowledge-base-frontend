<!-- 深度思考按钮 -->
<script setup lang="ts">
import { useChatStore } from '@/stores/modules/chat';

const chatStore = useChatStore();

const isDeepThinking = computed(() => chatStore.isDeepThinking);

// 切换是否深度思考
function setIsDeepThinking() {
  chatStore.setDeepThinking(!chatStore.isDeepThinking);
}
</script>

<template>
  <div
    :class="{ 'is-select': isDeepThinking }"
    class="deep-thinking-btn flex items-center p-10px rounded-10px rounded-15px cursor-pointer font-size-12px border-1px border-[rgba(0,0,0,0.08)] border-solid hover:bg-[rgba(0,0,0,.04)]"
    @click="setIsDeepThinking"
  >
    <el-icon>
      <ElementPlus />
    </el-icon>
    <span>深度思考</span>
  </div>
</template>

<style scoped lang="scss">
.deep-thinking-btn.is-select {
  color: var(--el-color-primary, #409eff);
  border: 1px solid var(--el-color-primary, #409eff);
  border-radius: 15px;
}
</style>
