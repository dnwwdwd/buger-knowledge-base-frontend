// 预留
import router from '@/routers/index';
import { useUserStore } from '@/stores';
import { useAuthStore } from '@/stores/modules/auth';

export async function initDynamicRouter() {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  try {
    // 1、预留： 获取菜单列表 || 按钮权限列表 || 递归菜单数据
    await authStore.requestAuthMenuList();

    // 2、判断当前用户是否拥有菜单权限
    // console.log('authStore.authMenuList', authStore.authMenuList);

    if (authStore.authMenuList == null || authStore.authMenuList.length === 0) {
      userStore.logout();
      return;
    }

    // 3、添加动态路由
    authStore.authMenuList.forEach((item: any) => {
      if (item.isFull === '0') {
        // 如果是全屏的话，直接为整个页面
        router.addRoute(item);
      }
      else {
        router.addRoute('layout', item);
      }
    });
  }
  catch (error) {
    console.log(error);
    // 当菜单请求出错时，重定向到首页
    userStore.logout();
    return Promise.reject(error);
  }
}
