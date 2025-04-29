<template>
    <div class="nav-header flex-box">
        <div class="header-left flex-box"> 
            <el-icon class="icon"  v-if="showFoldButton"  size="20" @click="toggleCollapse" ><Fold /></el-icon>
            <ul class="flex-box">
                <li v-for="(item,index) in selectMenu" 
                :key="item.path" 
                :class="{selected: route.path === item.path}" 
                class="tab flex-box">
                    <el-icon size="15"><component :is="item.icon"></component></el-icon>
                    <router-link class="text flex-box" :to="{path:item.path}">
                        {{ item.name }}
                    </router-link>
                    <el-icon class="close" size="15" @click="closeTab(item,index)"><Close /></el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown @command="handleClick">
                <div class="el-dropdown-link flex-box">
                    <el-avatar :src="userInfo.avatar"/>
                    <p class="user-name">{{ userInfo.name }}</p>
                </div>
                
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
                    <el-dropdown-item disabled>Action 4</el-dropdown-item>
                    <el-dropdown-item divided>Action 5</el-dropdown-item>
                </el-dropdown-menu>
                </template>
        </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useMenuStore } from '@/store/menu' // 引入Pinia store
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

const menuStore = useMenuStore() // 获取store实例
const route = useRoute()
const router = useRouter()
const userInfo = JSON.parse(localStorage.getItem('userInfo'))

// 直接访问state属性
// const showFoldButton = computed(() => menuStore.showFoldButton)
// const selectMenu = computed(() => menuStore.selectMenu)
const { showFoldButton, selectMenu } = storeToRefs(menuStore)

const handleClick = (command) => {
    if(command === 'cancel'){
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('pz_v3')
        window.location.href = window.location.origin
    }
}

function toggleCollapse() {
  menuStore.collapseMenu() // 直接调用action方法
  menuStore.hiddenIcon() // 直接调用action方法
}

function closeTab(item,index) {
    menuStore.closeMenu(item)
    //如果删除的是非当前页
    if(route.path !== item.path){
        return
    }
    //如果只剩最后一项
    const newMenu = selectMenu.value
    
    if(newMenu.length === 0) {
        router.push('/')
    }else {
        let targetIndex;
        // 判断是否删除的是最后一个元素
        if (index === newMenu.length) { // 删除的是最后一个元素
            targetIndex = index - 1; // 跳转到前一个标签
        } else {
            // 删除的是中间元素，跳转到下一个标签（原index的位置现在是下一个元素）
            targetIndex = index; 
        }
        router.push(newMenu[targetIndex].path);
    }
    
}

</script>

<style lang="less" scoped>
    .flex-box {
        display: flex;
        align-items: center;
    }
    .nav-header {
        justify-content: space-between;
        background-color: #fff;
        padding-right: 25px;
        .header-left{
            height: 100%;
            .icon{
                width: 45px;
                height: 100%;
            }
            .icon:hover{
                background-color: #f5f5f5;
                cursor: pointer;
            }
            .tab{
                padding: 0 10px;
                .text{
                    margin: 0 5px;
                    margin-bottom: 1px;
                }
                .close{
                    visibility: hidden;
                }
                &.selected{
                    a,i{
                        color: #409eff;
                    }

                }
            }
            .tab:hover{
                background-color: #f5f5f5;
                .close{
                    visibility: inherit;
                    cursor: pointer;
                }
            }
        }
        .header-right{
            .user-name{
                margin-left: 10px;
            }
        }
        a{
            color: #000;
            font-size: 15px;
            &:hover{
                color: #409eff;
                
            }
        } 
    }
</style>