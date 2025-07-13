import { COLLAPSE_THRESHOLD } from '@/config/index';
import { useWindowWidthObserver } from '@/hooks/useWindowWidthObserver';
import { useDesignStore } from '@/stores';

/**
 * 侧边栏折叠切换逻辑组合式函数 方便多个页面调用
 * @param threshold 折叠阈值（可选，默认使用全局配置）
 */
export function useCollapseToggle(threshold: number = COLLAPSE_THRESHOLD) {
  const designStore = useDesignStore();
  // 获取当前视口宽度是否大于阈值，但不做响应式处理，传入一个空函数执行
  const { isAboveThreshold } = useWindowWidthObserver(threshold, () => {});

  /** 核心折叠切换方法 */
  const changeCollapse = () => {
    // 切换最终折叠状态
    designStore.setCollapse(!designStore.isCollapse);

    if (isAboveThreshold.value) {
      // 宽屏逻辑
      if (designStore.isCollapse) {
        designStore.setCollapseType('alwaysCollapsed');
      }
      else {
        designStore.setCollapseType(
          designStore.collapseType === 'narrowExpandWideCollapse'
            ? 'alwaysExpanded'
            : 'followSystem',
        );
      }
    }
    else {
      // 窄屏逻辑
      if (designStore.isCollapse) {
        designStore.setCollapseType('followSystem');
      }
      else {
        designStore.setCollapseType(
          designStore.collapseType === 'alwaysCollapsed'
            ? 'narrowExpandWideCollapse'
            : 'alwaysExpanded',
        );
      }
    }
  };

  return {
    changeCollapse,
  };
}

// 使用示例与特性说明
// <script setup lang="ts">
// import { useCollapseToggle } from '@/hooks/useCollapseToggle';
// import { COLLAPSE_THRESHOLD } from '@/config/index'; (可传，不传入全局配置走)
// const { changeCollapseIcon } = useCollapseToggle(designStore, COLLAPSE_THRESHOLD);
// </script>
// <template>
//   <!-- 其他页面的按钮 -->
//   <button @click="changeCollapseIcon">切换侧边栏</button>
// </template>
