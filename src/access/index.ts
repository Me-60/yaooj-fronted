import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  console.log("1=====登录用户信息", store.state.user.loginUser);
  let loginUser = store.state.user.loginUser;
  console.log(loginUser);
  // 如果之前没登录过，自动登录
  if (!loginUser || !loginUser.userRole) {
    // 加 await 是为了等用户登录成功之后，在执行后续的代码
    await store.dispatch("user/getLoginUser");
    // 这里重新给loginUser赋值，是因为在页面刷新时vuex会被重置为默认值，所以userRole不存在了
    // 并且此页面需要权限不等于不登陆权限，userRole不存在会执行下方的条件判断为true并转到登录页面进行登录
    // 所以要重新赋值
    loginUser = store.state.user.loginUser;
    console.log("2=====登录用户信息", loginUser);
  }
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;

  // 要跳转的页面必须要登录
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    console.log("3=====");
    // 如果没登录，跳转到登录页面
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      console.log("4=====");
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果已经登录，权限不足的话，要跳转到无权限的页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
