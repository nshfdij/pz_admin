<template>
    <template
     v-for="(item, index) in props.menuData">
        <el-menu-item 
        @click="handClick(item,`${props.index}-${item.meta.id}`)" 
        v-if="!item.children || item.children.length === 0" 
        :index="`${props.index}-${item.meta.id}`" 
        :key="`${props.index}-${item.meta.id}`">
            <el-icon size="20">
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span> {{ item.meta.name }} </span>
        </el-menu-item>
        <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
            <template #title>
                <el-icon size="20">
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span> {{ item.meta.name }} </span>
            </template>
            <tree-menu :index="`${props.index}-${item.meta.id}`" :menuData="item.children" />
        </el-sub-menu>
    </template>
</template>

<script setup>
import { useMenuStore } from '@/store/menu.js' // 引入Pinia store
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['menuData', 'index'])
const router = useRouter()
const menuStore = useMenuStore() // 获取store实例


onMounted(() => {
  console.log('treeMenu接收的menuData:',props.menuData)
})
const handClick = (item, active) => {
  menuStore.addMenu(item.meta) // 直接调用action方法
  menuStore.updateMenuActive(active)
  router.push({ path: item.meta.path })
}

defineOptions({
  name: 'treeMenu'
})
</script>
<style scoped>

</style>