<template>
  <div id="userRegisterView">
    <h2 style="margin-bottom: 30px">用户注册</h2>
    <a-form
      style="max-width: 360px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" tooltip="账号不少于四位" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入用户账号" />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不少于八位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入用户密码"
        />
      </a-form-item>
      <a-form-item
        field="checkPassword"
        tooltip="密码与上次一致"
        label="确认密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请再次输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {
  UserControllerService,
  type UserRegisterRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  // 注册成功后，会跳转到登录页面，并且后退不会回到之前的页面，失败会有对应错误的提示
  if (res.code === 0) {
    message.success("注册成功，即将跳转登录页面");
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    // todo 需要完成注册信息有空白的情况消息提示，已找到那个问题所在，在后端用户控制层中的用户注册方法，有标注，之后在完成，这也不是什么大问题
    message.error("注册失败，" + res.message);
  }
};
</script>

<style scoped></style>
