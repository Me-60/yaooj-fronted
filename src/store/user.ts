// initial state

import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated/services/UserControllerService";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录", //这里把那个userRole给删掉了，是为了区分登录失败与未登录的状态，未登录的话就是不用角色状态，登录失败就是角色状态未登录
    },
  }),
  actions: {
    async getLoginUser({ commit, state }, payload) {
      // 从远程请求获取登录信息
      const res = await UserControllerService.getLoginUserUsingGet();
      console.log("远程获取的登录信息", res);
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser, // 这里的...state.loginUser是将state.loginUser这个属性进行展开，就相当于userName:state.loginUser.userName
          // 形式，不过一般是多个属性，一个一个赋的话比较麻烦，所以用...state.loginUser，而这里是提交更新数据，在原本基础上增加数据，因为赋值是覆盖的，
          // 所以要把原有属性加入，在添加新的属性，之后会明白的。
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
