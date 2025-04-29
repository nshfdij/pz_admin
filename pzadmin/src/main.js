import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import panelHead from './components/panelHead.vue'
import { useMenuStore } from './store/menu'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('panelHead',panelHead)

// store 状态管理
const pinia = createPinia()
// 使用持久化插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
// 递归添加路由函数
function recursivelyAddRoutes(routes) {
  routes.forEach(route => {
    if (route.children) {
      recursivelyAddRoutes(route.children);
    }
    if (!router.hasRoute(route.path)) {
      router.addRoute('main', route);
    }
  });
}
const localData = localStorage.getItem('pz_v3')
if (localData) {
  try {
    const parsedData = JSON.parse(localData);
    const menuStore = useMenuStore();
    menuStore.dynamicMenu(parsedData.routerList);
    recursivelyAddRoutes(menuStore.routerList);
    console.log('Registered routes:', router.getRoutes());

  } catch (error) {
    console.error('路由注册失败:', error);
  }
}

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');
  console.log('BeforeEach: token:', token, 'to.path:', to.path);

  if (!token && to.path !== '/login') {
      console.log('Redirect to login');
      return '/login';
  } else if (token && to.path === '/login') {
      console.log('Redirect to home');
      return '/dashboard';
  }
  // 其他情况允许正常跳转
  return true;
});

// 注册路由
app.use(router)
app.mount('#app')

