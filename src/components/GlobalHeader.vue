<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="100px"></a-col>
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectKeys"
        @menu-item-click="doMenuClick"
      >
        <!-- 这里的菜单栏路由点击跳转有问题，过程不详细 -->
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.png" />
            <div class="title">Yao OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>
        {{ store.state.user?.loginUser?.userName ?? "未登录" }}
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";

const router = useRouter();

//默认主页，这里的值通过下方的路由监听来进行改变，叫什么高亮，不太懂
const selectKeys = ref(["/"]);

//这里就是路由跳转后记住当前的路由路径，进行刷新时，会根据路由路径来进行刷新，保留跳转后页面，达到高亮，afterEach就是在路由跳转后记录，beforeEach就是路由跳转前判断是否跳转，搭配next
router.afterEach((to, from, failure) => {
  selectKeys.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

const store = useStore();

/*setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "Yao",
    userRole: ACCESS_ENUM.ADMIN,
  });
  console.log(store.state.user.loginUser);
}, 3000);*/

//提前把需要展示的路由进行过滤放入路由数组
/*const visibleRoutes = routes.filter((item, index) => {
  if (item.meta?.hideInMenu) {
    return false;
  }
  // todo 根据权限过滤菜单
  if (!checkAccess(loginUser, item?.meta?.access as string)) {
    return false;
  }
  return true;
});*/
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // todo 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
