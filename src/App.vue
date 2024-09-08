<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout v-if="isRouterActive" />
    </template>
  </div>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { nextTick, onMounted, provide, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute(); //获取当前路由

// 通过组件通信方式实现页面局部组件数据刷新
const isRouterActive = ref(true);

const reload = () => {
  isRouterActive.value = false;
  nextTick(() => {
    isRouterActive.value = true;
  });
};

provide("reload", reload);
/**
 *  全局初始化函数，有全局单词调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("全局项目入口");
};

onMounted(() => {
  doInit();
});
</script>
