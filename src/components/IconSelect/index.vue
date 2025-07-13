<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import SvgIcon from '@/components/SvgIcon/index.vue';
import icons from './requireIcons';

const emits = defineEmits(['selected']);
const { copy } = useClipboard();

const name = ref('');
const iconList = ref(icons);
console.log(icons);

function filterIcons() {
  iconList.value = JSON.parse(JSON.stringify(icons));
  if (name.value) {
    let index = 0;
    iconList.value.forEach((icons) => {
      iconList.value[index].iconList = icons.iconList.filter(item => item.includes(name.value));
      index++;
    });
  }
}

function selectedIcon(name: string) {
  emits('selected', name);
  copy(name);
  document.body.click();
}
</script>

<template>
  <div class="icons-container">
    <div class="icon-body">
      <el-tabs type="border-card">
        <div class="icon-search-box">
          <el-input
            v-model="name"
            clearable
            placeholder="请输入图标名称"
            @clear="filterIcons"
            @input="filterIcons"
          >
            <template #prefix>
              <el-icon>
                <search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <el-tab-pane
          v-for="classify of iconList"
          :key="classify.classifyName"
          :label="classify.classifyName"
        >
          <div class="grid-container">
            <div v-for="item of classify.iconList" :key="item" @click="selectedIcon(item)">
              <div class="icon-item flex-center flex-col gap-3px">
                <SvgIcon :name="item" />
                <span class="icon_name text-overflow max-w-80px">
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style rel="stylesheet/scss" scoped lang="scss">
// 菜单图标选择样式
.el-popover {
  .grid-container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  }
  .icon-item {
    width: fit-content !important;
    height: fit-content;
    padding: 0 4px;
    margin: 3px 0 !important;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
  }
  .icon-item:hover {
    box-shadow: 1px 1px 10px 0 #a1a1a1;
  }
  .el-tab-pane {
    height: 200px;
    overflow: auto;
  }
  .icon_name {
    display: none;
  }
}

// 菜单选择页面样式
.icons-container {
  .icon-body {
    padding: 10px;
  }
  .icon_name {
    display: block;
  }

  overflow: hidden;
  .grid-container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    height: 500px;
    margin-top: 12px;
    overflow: hidden auto;
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
  }
  .icon-item {
    width: 100% !important;
    padding: 16px 0;
    margin: 0 !important;
    margin-right: -1px;
    margin-bottom: -1px;
    text-align: center;
    border-right: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
  }
  span {
    display: block;
    margin-top: 4px;
    font-size: 16px;
  }
  .disabled {
    pointer-events: none;
  }
  .grid {
    border-top: 1px solid #eeeeee;
  }
}
.icons-container svg {
  span,
  svg {
    font-size: 24px !important;
    color: #606266;
  }
}
</style>
