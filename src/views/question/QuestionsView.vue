<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="题目名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入题目名称" />
      </a-form-item>
      <a-form-item field="tags" label="题目标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入题目标签" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
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
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(tag, index) of record.tags"
            :key="index"
            color="#0fc6c2"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        <!--        此处要注意除数是否为零-->
        {{
          record.submitNum
            ? (record.acceptedNum / record.submitNum).toFixed(2)
            : "0.00"
        }}% （{{ record.acceptedNum }}/{{ record.submitNum }}）
      </template>
      <template #updateTime="{ record }">
        {{ moment(record.updateTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionExerciseView(record)"
            >练习
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);

const total = ref(0);

const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 5,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
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
    title: "题目编号",
    dataIndex: "id",
  },
  {
    title: "题目标题",
    dataIndex: "title",
  },
  {
    title: "题目标签",
    slotName: "tags",
  },
  {
    title: "通过率（通过数 / 提交总数）",
    slotName: "acceptedRate",
  },
  {
    title: "更新时间",
    slotName: "updateTime",
  },
  {
    slotName: "optional",
  },
];

const router = useRouter();

/**
 * 跳转到习题练习页面
 * @param question
 */
const toQuestionExerciseView = (question: Question) => {
  router.push({
    path: `/exercise/question/${question.id}`,
  });
};

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
// todo 需要了解分页机制，并且有个问题 doSearch 中重置搜索页号才可以实现后边也搜索前边页中的内容时，才可以实现呢
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: auto;
}
</style>
