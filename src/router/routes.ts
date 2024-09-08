import { RouteRecordRaw } from "vue-router";
import NoAuthView from "@/views/NoAuthView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import UpdateQuestionView from "@/views/question/UpdateQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ExerciseQuestionView from "@/views/question/ExerciseQuestionView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/questions",
    name: "浏览习题",
    component: QuestionsView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/question_submit",
    name: "习题提交列表",
    component: QuestionSubmitView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/exercise/question/:id",
    name: "在线练习",
    component: ExerciseQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/add/question",
    name: "创建习题",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/manage/question",
    name: "管理习题",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/update/question",
    name: "修改习题",
    component: UpdateQuestionView,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/",
    name: "主页",
    component: QuestionsView,
  },
  /*{
    path: "/hide",
    name: "隐藏页面",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },*/
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  /*{
    path: "/admin",
    name: "仅管理员可见",
    component: AdminView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },*/
  /*{
    path: "/about",
    name: "关于",
    component: () => import("../views/AboutView.vue"),
  },*/
];
