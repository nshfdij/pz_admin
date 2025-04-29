// src/store/menu.js
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    isCollapse: false,
    selectMenu: [],
    showFoldButton: true,
    routerList: [],
    menuActive: '1-1'
  }),
  actions: {
    collapseMenu() {
      this.isCollapse = !this.isCollapse
    },
    
    hiddenIcon() {
      this.showFoldButton = false
    },
    
    showIcon() {
      this.showFoldButton = true
    },
    
    addMenu(payload) {
      if (!this.selectMenu.find(item => item.path === payload.path)) {
        this.selectMenu.push(payload)
      }
    },
    
    closeMenu(payload) {
      const index = this.selectMenu.findIndex(val => val.name === payload.name)
      if (index !== -1) this.selectMenu.splice(index, 1)
    },
    dynamicMenu(payload) {
      const modules = import.meta.glob('../views/**/**/*.vue');
      console.log('modules:', modules);

      function routerSet(router) {
        router.forEach(route => {
          if (!route.children) {
            
            const url = `../views${route.meta.path}/index.vue`; 
            console.log('Constructed url:', url); // 打印构造的 url

            // 确保 url 与 modules 中的键完全匹配
            if (modules[url]) {
              route.component = modules[url];
            } else {
              console.error('Module not found for url:', url);
            }
          } else {
            routerSet(route.children);
          }
        });
      }

      routerSet(payload);
      this.routerList = payload;
      console.log('动态路由加载完成:', JSON.parse(JSON.stringify(this.routerList)))

    },
    updateMenuActive(payload) {
      this.menuActive = payload
    },
    
  },
  persist: {
    key: 'pz_v3', // 持久化存储的键名
    storage: localStorage, // 使用 localStorage 进行持久化存储
  }
})