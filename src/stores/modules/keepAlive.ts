import { defineStore } from 'pinia';

export const useKeepAliveStore = defineStore(
  'keep-alive',
  () => {
    const keepAliveName = ref<string[]>([]);

    const addKeepAliveName = (name: string) => {
      if (!keepAliveName.value.includes(name)) {
        keepAliveName.value.push(name);
      }
    };

    const removeKeepAliveName = (name: string) => {
      keepAliveName.value = keepAliveName.value.filter(item => item !== name);
    };

    const setKeepAliveName = (name: string[]) => {
      keepAliveName.value = name;
    };

    return {
      keepAliveName,
      addKeepAliveName,
      removeKeepAliveName,
      setKeepAliveName,
    };
  },
  {
    persist: true,
  },
);
