<template>
  <div>浏览习题模块</div>
  {{ codeValue }}
  <CodeEditor :value="codeValue" :handle-change="onCodeChange" />
  <MdEditor :value="mdValue" :handle-change="onMdChange" />
</template>

<script setup lang="ts">
import MdEditor from "@/components/MdEditor.vue";
import { ref } from "vue";
import CodeEditor from "@/components/CodeEditor.vue";

const mdValue = ref();
const codeValue = ref();

const onMdChange = (v: string) => {
  mdValue.value = v;
};
const onCodeChange = (v: string) => {
  codeValue.value = v;
};
</script>

<style scoped></style>
