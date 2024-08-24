<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :style="{ width: '500px' }"
    :mask-closable="false"
  >
    <template #header>筛选题目</template>
    <n-form ref="form" :model="form">
      <n-form-item label="题干">
        <n-input
          v-model:value="form.keyword"
          maxlength="2000"
          type="textarea"
          placeholder="为保证显示效果, 建议控制在110个字符以内"
        />
      </n-form-item>
      <n-form-item label="科目">
        <n-select v-model:value="form.sid" placeholder="请选择科目" :options="subjects" />
      </n-form-item>
    </n-form>
    <div class="flex justify-between align-center">
      <n-button @click="clean">清除筛选</n-button>
      <n-button type="primary" @click="submit">提交</n-button>
    </div>
  </n-modal>
</template>
<script>
import { CheckRound } from "@vicons/material";
export default {
  components: { CheckRound },
  props: {
    subjects: {
      type: Array,
      default: [],
    },
    type: {
      type: Array,
      default: [],
    },
  },
  emits: ["update"],
  data: () => ({
    show: false,
    form: {
      sid: null,
      keyword: "",
    },
    level: [
      {
        label: "极易",
        value: 1,
      },
      {
        label: "容易",
        value: 2,
      },
      {
        label: "一般",
        value: 3,
      },
      {
        label: "较难",
        value: 4,
      },
      {
        label: "极难",
        value: 5,
      },
    ],
  }),
  methods: {
    open(screen) {
      this.show = true;
      this.form = screen;
    },
    clean() {
      this.form = {
        sid: null,
        keyword: "",
      };
      this.submit();
    },
    submit() {
      this.$emit("update", this.form);
      this.show = false;
    },
  },
};
</script>
<style scoped></style>
