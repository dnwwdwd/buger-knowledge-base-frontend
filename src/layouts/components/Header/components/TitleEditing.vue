<!-- 标题编辑 -->
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useSessionStore } from '@/stores/modules/session';

const sessionStore = useSessionStore();

const currentSession = computed(() => sessionStore.currentSession);

function handleClickTitle() {
  ElMessageBox.prompt('', '编辑对话名称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputErrorMessage: '请输入对话名称',
    confirmButtonClass: 'el-button--primary',
    cancelButtonClass: 'el-button--info',
    roundButton: true,
    inputValue: currentSession.value?.sessionTitle,
    inputValidator: (value) => {
      if (!value) {
        return false;
      }
      return true;
    },
  })
    .then(({ value }) => {
      sessionStore
        .updateSession({
          id: currentSession.value!.id,
          sessionTitle: value,
          sessionContent: currentSession.value!.sessionContent,
        })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '修改成功',
          });
          nextTick(() => {
            // 如果是当前会话，则更新当前选中会话信息
            sessionStore.setCurrentSession({
              ...currentSession.value,
              sessionTitle: value,
            });
          });
        });
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: '取消修改',
      // });
    });
}
</script>

<template>
  <div v-if="currentSession" class="w-full h-full flex flex-col justify-center">
    <div class="box-border mr-20px">
      <div
        class="title-editing-container p-4px w-fit max-w-full flex items-center justify-start cursor-pointer select-none hover:bg-[rgba(0,0,0,.04)] cursor-pointer rounded-md font-size-14px"
        @click="handleClickTitle"
      >
        <div class="text-overflow select-none pr-8px">
          {{ currentSession.sessionTitle }}
        </div>
        <SvgIcon name="draft-line" size="14" class="flex-none c-gray-500" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title-editing-container {
  transition: all 0.3s ease;
  &:hover {
    .svg-icon {
      display: block;
      opacity: 1;
    }
  }
  .svg-icon {
    display: none;
    opacity: 0.5;
    transition: all 0.3s ease;
  }
}
</style>
