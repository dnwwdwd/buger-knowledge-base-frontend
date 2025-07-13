import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const store = createPinia();

store.use(piniaPluginPersistedstate);

export default store;

// export * from './modules/chat';
export * from './modules/design';
export * from './modules/user';
