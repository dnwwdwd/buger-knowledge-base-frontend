import type { GetSessionListVO } from '@/api/model/types';
import { defineStore } from 'pinia';
import { getModelList } from '@/api';

// 模型管理
export const useModelStore = defineStore('model', () => {
  // 当前模型
  const currentModelInfo = ref<GetSessionListVO>({});

  // 设置当前模型
  const setCurrentModelInfo = (modelInfo: GetSessionListVO) => {
    currentModelInfo.value = modelInfo;
  };

  // 模型菜单列表
  const modelList = ref<GetSessionListVO[]>([]);
  // 请求模型菜单列表
  const requestModelList = async () => {
    try {
      const res = await getModelList();
      modelList.value = res.data;
    }
    catch (error) {
      console.error('requestModelList错误', error);
    }
  };

  return {
    currentModelInfo,
    setCurrentModelInfo,
    modelList,
    requestModelList,
  };
});
