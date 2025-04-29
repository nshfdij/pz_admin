import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'
import api from './api/api'
import { setRouter } from './api/request';

// createApp(App).mount('#app')

const app = createApp(App)
// 路由注入需要在挂载前执行
app.use(router)
setRouter(router);
app.mount('#app')
app.config.globalProperties.$api=api

router.beforeEach((to, from) => {
    // 返回 false 以取消导航
    if(to.path !== '/login'){
        if(!localStorage.getItem('token')){
            return '/login'
        }
    }
  })