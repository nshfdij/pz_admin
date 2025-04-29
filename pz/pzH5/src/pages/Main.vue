<template>
  <RouterView />
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="item in useRouter().options.routes[0].children"
      :url="`#/${item.path}`"
      :icon="item.meta.icon"
      >{{ item.meta.name }}</van-tabbar-item
    >
  </van-tabbar>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const active = ref(0);

onMounted(() => {
  let arr = useRouter().options.routes[0];
  active.value = arr.children.findIndex(
    (item) => "/" + item.path == useRoute().path
  );
});
</script>
