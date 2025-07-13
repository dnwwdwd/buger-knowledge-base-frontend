<!-- 主布局 -->
<script setup lang="ts">
import type { LayoutType } from '@/config/design';
// import { useScreenStore } from '@/hooks/useScreen';
import LayoutVertical from '@/layouts/LayoutVertical/index.vue';
import { useDesignStore } from '@/stores';

// 这里添加布局类型
const LayoutComponent: Record<LayoutType, Component> = {
  vertical: LayoutVertical,
};

const designStore = useDesignStore();
// const { isMobile } = useScreenStore();
/** 获取布局格式 */
const layout = computed((): LayoutType => designStore.layout);
</script>

<template>
  <div>
    <component :is="LayoutComponent[layout]" />
  </div>
</template>

<style scoped lang="scss"></style>
