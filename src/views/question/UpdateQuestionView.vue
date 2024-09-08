<template>
  <div id="updateQuestionView">
    <h2>修改习题</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="题目标题">
        <a-input v-model="form.title" placeholder="请输入题目标题" />
      </a-form-item>
      <a-form-item field="tags" label="题目标签">
        <a-input-tag
          v-model="form.tags"
          placeholder="请选择题目标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="题目答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item label="题目限制" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              size="large"
              class="input-demo"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              size="large"
              class="input-demo"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              size="large"
              class="input-demo"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item label="题目用例" :content-flex="false" :merge-props="false">
        <div>
          <a-button type="outline" @click="handleAdd">
            <icon-plus />
            添加用例
          </a-button>
        </div>
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
        >
          <a-space direction="vertical" style="min-width: 482px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例-${index + 1}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入测试输入用例"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输出用例-${index + 1}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入测试输出用例"
              />
            </a-form-item>
            <a-button status="danger" @click="handleDelete(index)">
              <icon-delete />
              删除
            </a-button>
          </a-space>
        </a-form-item>
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          style="min-width: 200px"
          @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import MdEditor from "@/components/MdEditor.vue";
import { IconDelete, IconPlus } from "@arco-design/web-vue/es/icon";
import {
  QuestionControllerService,
  type QuestionUpdateRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";

const route = useRoute();

onMounted(() => {
  loadData();
});

/**
 * 根据题目 id 获取修改习题旧数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // JSON 转 js对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("数据加载失败，" + res.message);
  }
};

const form = ref({
  title: "",
  tags: [],
  content: "",
  answer: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "1 2",
      output: "3 4",
    },
  ],
});

/**
 * 新增测试用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};
/**
 * 删除测试用例
 * @param index
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

/**
 * 提交习题表单，修改习题
 */
const doSubmit = async () => {
  console.log(form.value);
  const res = await QuestionControllerService.updateQuestionUsingPost(
    form.value
  );
  if (res.code === 0) {
    message.success("习题修改成功");
  } else {
    message.error("习题修改失败，原因为" + res.message);
  }
};

/**
 * 题目内容和答案子组件数据交互改变
 */
const onContentChange = (value: string) => {
  form.value.content = value;
};
const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped>
#updateQuestionView {
}
</style>
