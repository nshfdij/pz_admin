<template>
    <el-menu
    :style="{width: !isCollapse? '200px': '60px'}"  
    class="el-menu-vertical-container"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    :collapse-transition="false"
    :default-active="active"
    >
      <p class="logo" v-if="!isCollapse">管理系统</p>
      <el-icon class="icon-home" size="20" v-else @click="toggleMenuExpand" ><HomeFilled /></el-icon>
      
      <TreeMenu :menuData="menuData" :index="'1'"/>
    </el-menu>
  </template>
  
<script setup>
  import { useMenuStore } from '@/store/menu' // 引入Pinia store
  import TreeMenu from './treeMenu.vue'
  import { reactive,computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // const menuData = reactive(router.options.routes[0].children)
  const menuStore = useMenuStore() // 获取store实例
  const menuData = computed({
    get() {
      return menuStore.routerList;
    },
    set(newValue) {
      menuStore.routerList = newValue;
    }
  })
console.log('aside.vue 中的 menuStore:', menuStore); // 新增日志

  // 直接访问state属性
  const isCollapse = computed(() => menuStore.isCollapse) 
  const active = computed(() => menuStore.menuActive)
  const handleOpen = ()=>{}
  const handleClose = ()=>{}
  function toggleMenuExpand() {
    menuStore.collapseMenu() // 直接调用action方法
    menuStore.showIcon() // 直接调用action方法
}

  </script>


<style lang="less" scoped>
.el-menu-vertical-container{
  height: 100%;
}
.logo{
  color: #303133;
  text-align: center;
  line-height: 50px;
}
.icon-home{
  font-size: 20px;
  color: #303133;
  align-items: center;
  justify-content: center;
  display: flex;
  height: 55px;
  margin-left: 22px;
}
.icon-home:hover{
  color: #409EFF;
  background-color: #fff;
}
</style>