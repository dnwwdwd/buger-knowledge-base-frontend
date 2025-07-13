<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';

export type PopoverPlacement
  = | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

export type Offset = [number, number];

export interface PopoverProps {
  placement?: PopoverPlacement;
  offset?: Offset;
  popoverStyle?: CSSProperties;
  popoverClass?: string;
  trigger?: 'hover' | 'click' | 'clickTarget';
  triggerStyle?: CSSProperties;
  triggerClass?: string;
  hoverDelay?: number; // 悬停延迟关闭时间（ms）
}

const props = withDefaults(defineProps<PopoverProps>(), {
  placement: 'bottom',
  offset: () => [0, 0],
  trigger: 'hover',
  hoverDelay: 0, // 默认300ms延迟关闭
});

const emits = defineEmits<{
  (e: 'show'): void;
  (e: 'hide'): void;
}>();

const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const floatingArrow = ref<HTMLElement | null>(null);
const showPopover = ref(false);
let hideTimeout: ReturnType<typeof setTimeout> | null = null;
// 新增：记录鼠标是否在触发元素或内容区域内
const isHovering = ref(false);

const { floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: props.placement,
  transform: false,
  whileElementsMounted: autoUpdate,
  middleware: [
    shift(),
    flip(),
    arrow({ element: floatingArrow }),
    offset({
      mainAxis: props.offset[0],
      crossAxis: props.offset[1],
    }),
  ],
});

function show() {
  if (!showPopover.value) {
    showPopover.value = true;
    emits('show');
  }
  // 显示时强制清除定时器（无论是否在悬停）
  if (hideTimeout)
    clearTimeout(hideTimeout);
  hideTimeout = null;
}

function hide() {
  if (showPopover.value) {
    showPopover.value = false;
    emits('hide');
  }
  hideTimeout = null;
}

defineExpose({ show, hide });

watch(showPopover, (newValue) => {
  if (newValue && props.trigger !== 'hover') {
    onClickOutside(popoverRef, () => hide(), {
      ignore: [triggerRef] as any[],
    });
  }
});

// 触发元素鼠标事件调整（同步isHovering状态）
function handleTriggerMouseEnter() {
  if (props.trigger === 'hover') {
    isHovering.value = true; // 进入触发元素
    show();
  }
}

function handleTriggerMouseLeave() {
  if (props.trigger === 'hover') {
    isHovering.value = false; // 离开触发元素
    // 仅当鼠标不在内容区域时，才设置延迟关闭
    scheduleHideIfNeeded();
  }
}

// 内容区域鼠标事件调整（同步isHovering状态）
function handlePopoverMouseEnter() {
  if (props.trigger === 'hover') {
    isHovering.value = true; // 进入内容区域
    if (hideTimeout)
      clearTimeout(hideTimeout); // 取消关闭
  }
}

function handlePopoverMouseLeave() {
  if (props.trigger === 'hover') {
    isHovering.value = false; // 离开内容区域
    // 仅当鼠标不在触发元素时，才设置延迟关闭
    scheduleHideIfNeeded();
  }
}

// 新增：统一延迟关闭逻辑（仅当完全离开两个区域时触发）
function scheduleHideIfNeeded() {
  // 如果鼠标仍在任一区域（isHovering为true），不关闭
  if (isHovering.value)
    return;

  // 否则设置延迟关闭
  hideTimeout = setTimeout(() => {
    if (!isHovering.value) {
      // 再次确认是否仍离开
      hide();
    }
  }, props.hoverDelay);
}

function handleClick() {
  if (props.trigger === 'click') {
    showPopover.value ? hide() : show();
  }
  else if (props.trigger === 'clickTarget' && !showPopover.value) {
    show();
  }
}
</script>

<template>
  <div
    ref="triggerRef"
    class="popover-trigger"
    :class="[props.triggerClass]"
    :style="[props.triggerStyle]"
    @mouseenter="handleTriggerMouseEnter"
    @mouseleave="handleTriggerMouseLeave"
    @click="handleClick"
  >
    <slot name="trigger" />
  </div>

  <Teleport to="body">
    <Transition name="popover-fade">
      <div
        v-if="showPopover"
        ref="popoverRef"
        :style="[floatingStyles, props.popoverStyle]"
        class="popover-content-box"
        :class="[props.popoverClass]"
        @mouseenter="handlePopoverMouseEnter"
        @mouseleave="handlePopoverMouseLeave"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  will-change: transform, opacity;
}
.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.popover-fade-enter-to,
.popover-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
