<script setup lang="ts">
const props = defineProps<{
  className?: string;
  name: string;
  color?: string;
  size?: string;
}>();

const iconName = computed(() => `#icon-${props.name}`);
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`;
  }
  return 'svg-icon';
});
</script>

<template>
  <svg :class="svgClass" aria-hidden="true" :style="{ fontSize: size }">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<style scope lang="scss">
.sub-el-icon,
.nav-icon {
  position: relative;
  display: inline-block;
  margin-right: 12px;
  font-size: 15px;
}
.svg-icon {
  position: relative;
  width: 1em;
  height: 1em;
  vertical-align: -2px;
  fill: currentColor;
}
</style>
