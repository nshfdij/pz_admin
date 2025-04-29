<template>
    <div class="common-layout">
      <el-container>
        <!-- <el-aside width="200px">Aside</el-aside> -->
        <Aside />
        <el-container>
          <el-main>
            <Header/>
            <RouterView/>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </template>

<script setup>
import Aside from '../components/aside.vue'
import Header from '../components/navHeader.vue'
</script>

<style lang="less" scoped>
.common-layout{
    height: 100%;
    background-color: #fff;
    .el-container{
        height: 100%;
        width: 100%;
    }
    .el-main{
        padding: 10px;
    }
}
</style>