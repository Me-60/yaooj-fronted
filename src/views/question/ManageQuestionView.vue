<template>
  <div id="manageQuestionView">
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
      <template #updateTime="{ record }">
        {{ moment(record.updateTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" size="mini" @click="doUpdate(record)"
            >修改</a-button
          >
          <a-button status="danger" size="mini" @click="doDelete(record)"
            >删除</a-button
          >
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment/moment";

const dataList = ref([]);

const total = ref(0);

const searchParams = ref({
  pageSize: 5,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
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
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "题目标题",
    dataIndex: "title",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "题目内容",
    dataIndex: "content",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "题目标签",
    dataIndex: "tags",
  },
  {
    title: "题目答案",
    dataIndex: "answer",
  },
  {
    title: "题目配置",
    dataIndex: "judgeConfig",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "题目用例",
    dataIndex: "judgeCase",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "用户id",
    dataIndex: "userId",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "更新时间",
    slotName: "updateTime",
  },
  {
    title: "管理操作",
    slotName: "optional",
  },
];

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除题目操作成功");
    loadData();
  } else {
    message.error("删除题目操作失败，" + res.message);
  }
};

const router = useRouter();

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
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

watchEffect(() => {
  loadData();
});
</script>

<style scoped>
#manageQuestionView {
  margin: auto;
}
</style>
