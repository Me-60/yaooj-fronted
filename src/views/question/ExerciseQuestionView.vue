<template>
  <div id="exerciseQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs type="rounded" size="medium" default-active-key="question">
          <a-tab-pane key="question" title="习题详情">
            <a-card v-if="question" :title="question.title">
              <template #extra>
                <div class="questionTags">
                  <a-link>
                    <a-tag
                      v-for="(tag, index) of question.tags"
                      :key="index"
                      color="#0fc6c2"
                      style="margin: 3px"
                      >{{ tag }}
                    </a-tag>
                  </a-link>
                </div>
              </template>
              <a-descriptions
                title="习题限制"
                bordered
                :column="{ xs: 1, md: 2, lg: 3 }"
                align="center"
              >
                <a-descriptions-item label="时间限制（ms）"
                  >{{ question.judgeConfig.timeLimit }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制（KB）"
                  >{{ question.judgeConfig.memoryLimit }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制（KB）"
                  >{{ question.judgeConfig.stackLimit }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="用户评论" disabled>
            该功能暂未实现
          </a-tab-pane>
          <a-tab-pane key="answer" title="习题答案">
            暂时无法查看答案
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-select
          v-model="form.language"
          style="width: 320px"
          placeholder="请选择编程语言"
        >
          <a-option
            v-for="(languageOption, index) of languageOptions"
            :key="index"
            :value="languageOption.value"
            :label="languageOption.label"
          />
        </a-select>
        {{ form.language }}
        <CodeEditor :value="form.code" :handle-change="onCodeChange" />
        <a-divider size="0" />
        <a-button
          type="primary"
          @click="doSubmit"
          shape="round"
          style="min-width: 160px"
          >提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, defineProps, onMounted } from "vue";
import {
  QuestionControllerService,
  type QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

/**
 * 编程语言选项
 */
const languageOptions = [
  {
    value: "java",
    label: "Java",
  },
  {
    value: "cpp",
    label: "C++",
  },
  {
    value: "go",
    label: "Golang",
  },
];

const question = ref<QuestionVO>();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败" + res.message);
  }
};

onMounted(() => {
  loadData();
});

// todo 实现习题展示区域内容可以滚动而非浏览器提供的滚动

const form = ref<QuestionSubmitAddRequest>({
  questionId: props.id as any,
  language: "java",
  code: "",
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  const res = await QuestionControllerService.doQuestionSubmitUsingPost(
    form.value
  );
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败" + res.message);
  }
};

/**
 * 编辑代码子组件交互
 * @param value
 */
const onCodeChange = (value: string) => {
  form.value.code = value;
};
</script>

<style scoped>
#exerciseQuestionView {
  max-width: 1400px;
  margin: auto;
}
</style>
