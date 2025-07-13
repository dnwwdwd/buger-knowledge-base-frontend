import type { Ref } from 'vue';

type SafeAreaDirection = 'left' | 'right' | 'top' | 'bottom';

interface SafeAreaOptions {
  direction: SafeAreaDirection; // 必选方向
  size: number; // 安全区域尺寸（像素）
  onChange?: (isInArea: boolean, e: MouseEvent) => void; // 状态变化回调
  enabled?: Ref<boolean>; // 改为接收响应式变量（Ref 类型）
}

export function useSafeArea(options: SafeAreaOptions): { isInSafeArea: Ref<boolean> } {
  const { direction, size, onChange, enabled = ref(true) } = options; // 默认值改为 ref(true)
  const isInSafeArea = ref(false);
  let isThrottling = false;

  // 方向检测逻辑（未修改）
  const checkInArea = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const w = window.innerWidth;
    const h = window.innerHeight;
    return direction === 'left'
      ? clientX <= size
      : direction === 'right'
        ? clientX >= w - size
        : direction === 'top'
          ? clientY <= size
          : direction === 'bottom'
            ? clientY >= h - size
            : false;
  };

  // 鼠标移动处理函数（未修改）
  const handleMouseMove = (e: MouseEvent) => {
    if (!enabled.value || isThrottling)
      return; // 直接使用 enabled.value 判断

    requestAnimationFrame(() => {
      const current = checkInArea(e);
      if (current !== isInSafeArea.value) {
        isInSafeArea.value = current;
        onChange?.(current, e);
      }
      isThrottling = false;
    });
    isThrottling = true;
  };

  // 动态绑定/解绑事件（简化逻辑）
  const toggleListener = (enable: boolean) => {
    if (enable) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    else {
      window.removeEventListener('mousemove', handleMouseMove);
      isInSafeArea.value = false; // 关闭时重置状态
    }
  };

  // 监听 enabled 的变化（直接监听传入的 ref）
  watch(
    enabled,
    (newVal) => {
      toggleListener(newVal);
    },
    { immediate: true },
  ); // 立即执行一次，处理初始状态

  // 组件卸载时强制解绑
  onUnmounted(() => {
    toggleListener(false);
  });

  return { isInSafeArea };
}

// 使用示例
// 外部组件中
// import { useSafeArea } from '@/hooks/useSafeArea';

// const isListening = ref(false); // 响应式开关
// const { isInSafeArea } = useSafeArea({
//   direction: 'left',
//   size: 50,
//   onChange: (isIn, e) => console.log('状态变化：', isIn),
//   enabled: isListening // 直接传入响应式变量（无需 .value）
// });
