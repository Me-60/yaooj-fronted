<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题目 id" style="min-width: 240px">
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入题目 id"
        />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          placeholder="选择编程语言"
          allow-clear
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSearch">搜索</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doFlush">刷新</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        total,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        simple: true,
      }"
      @page-change="onPageChange"
      column-resizable
      :bordered="{ cell: true }"
    >
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref([]);

const total = ref(0);

const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 5,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败" + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "题目提交 id",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];

const router = useRouter();

/**
 * 根据表格分页页数改变触发函数修改searchParams的值，虽然当前页数发生修改
 * 而表格内容并未随页数而更新，需要一个监听，当更新数据的方法的任何地方发生
 * 改变，该监听方法会重新调用更新数据的方法，如下的watchEffect，这是一个
 * 监听函数
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 监听此函数是否有变化，有变化就重新加载
 * 监听searchParams
 */
watchEffect(() => {
  loadData();
});

/**
 * 确认搜索，重新加载数据
 */
const doSearch = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

const reload = inject<any>("reload");

const doFlush = () => {
  reload();
};
// todo 需要了解分页机制，并且有个问题 doSearch 中重置搜索页号才可以实现后边也搜索前边页中的内容时，才可以实现呢
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: auto;
}
</style>
