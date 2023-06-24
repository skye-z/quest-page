<template>
  <n-modal
    v-model:show="form.show"
    preset="card"
    :style="{ width: '800px' }"
    :mask-closable="false"
  >
    <template #header>
      {{ form.id ? "编辑试卷" : "添加试卷" }}
    </template>
    <div class="flex justify-between">
      <n-form
        ref="form"
        :disabled="form.loading"
        :model="form"
        :rules="rules"
        style="width: 400px"
      >
        <n-form-item path="name" label="考试名称">
          <n-auto-complete
            v-model:value="form.name"
            clear-after-select
            placeholder="请输入考试名称"
          />
        </n-form-item>
        <div class="flex">
          <n-form-item class="full-width mr-10" path="sid" label="科目">
            <n-select
              v-model:value="form.sid"
              @update:value="getQuestionNumber"
              placeholder="请选择科目"
              :options="subjects"
            />
          </n-form-item>
          <n-form-item v-if="form.sid" class="full-width" label="关键词">
            <n-auto-complete
              v-model:value="form.keyword"
              clear-after-select
              placeholder="请输入题目关键词"
            />
          </n-form-item>
        </div>
        <n-scrollbar
          style="height: 400px; border-radius: 12px; margin-top: -10px"
          trigger="none"
        >
          <div
            v-for="item in list"
            class="question-item pa-5 border-bottom"
            @click="addQuestion(item)"
          >
            <div class="mb-5">{{ item.question }}</div>
            <div>
              <n-tag
                v-if="item.level == 1 || item.level == 2"
                :bordered="item.level == 1"
                size="small"
                type="success"
                >{{ item.level == 1 ? "极易" : "容易" }}</n-tag
              >
              <n-tag v-else-if="item.level == 3" size="small" type="warning">一般</n-tag>
              <n-tag
                v-else-if="item.level == 4 || item.level == 5"
                :bordered="item.level == 4"
                size="small"
                type="error"
                >{{ item.level == 4 ? "较难" : "极难" }}</n-tag
              >
              <n-tag class="ml-5" :bordered="false" type="info" size="small">{{
                type[item.type - 1].label
              }}</n-tag>
            </div>
          </div>
        </n-scrollbar>
        <n-pagination
          v-if="number > 0"
          class="justify-center mt-10"
          :page-slot="7"
          v-model:page="page"
          :item-count="number"
          @update:page="getQuestionList"
        />
      </n-form>
      <div class="full-width ml-10" v-if="form.sid">
        <div class="mb-10" style="line-height: 14px">
          卷面 <span class="text-gray">{{ form.questions.length }}</span>
        </div>
        <n-scrollbar style="max-height: 535px; border-radius: 12px" trigger="none">
          <div
            v-for="(item, index) in form.questions"
            class="question-item pa-5 border-bottom"
            @click="delQuestion(index)"
          >
            <div class="mb-5">{{ item.question }}</div>
            <div>
              <n-tag
                v-if="item.level == 1 || item.level == 2"
                :bordered="item.level == 1"
                size="small"
                type="success"
                >{{ item.level == 1 ? "极易" : "容易" }}</n-tag
              >
              <n-tag v-else-if="item.level == 3" size="small" type="warning">一般</n-tag>
              <n-tag
                v-else-if="item.level == 4 || item.level == 5"
                :bordered="item.level == 4"
                size="small"
                type="error"
                >{{ item.level == 4 ? "较难" : "极难" }}</n-tag
              >
              <n-tag class="ml-5" :bordered="false" type="info" size="small">{{
                type[item.type - 1].label
              }}</n-tag>
            </div>
          </div>
        </n-scrollbar>
        <div class="text-right mt-10">
          <n-button :loading="form.loading" type="primary" @click="submit">
            <template #icon>
              <n-icon>
                <CheckRound />
              </n-icon>
            </template>
            完成{{ form.id ? "编辑" : "添加" }}
          </n-button>
        </div>
      </div>
      <div v-else class="full-width flex align-center justify-center">
        <div class="mt-10">请先选择科目</div>
      </div>
    </div>
  </n-modal>
</template>
<script>
import { CheckRound } from "@vicons/material";
import { exam, question } from "../../plugins/api";
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
    form: {
      show: false,
      loading: false,
      sid: null,
      name: "",
      keyword: "",
      question: [],
    },
    rules: {
      name: {
        required: true,
        message: "考试名称不能为空",
        trigger: ["blur", "change"],
      },
      sid: {
        required: true,
        message: "科目不能为空",
        type: "number",
        trigger: ["blur", "change"],
      },
    },
    options: {
      form: [],
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
    },
    page: 0,
    number: 0,
    list: [],
  }),
  methods: {
    add() {
      this.form = {
        show: true,
        loading: false,
        sid: null,
        name: "",
        keyword: "",
        questions: [],
      };
      this.page = 0;
      this.number = 0;
      this.list = [];
    },
    edit(item) {
      if (item.options != null && item.options.indexOf("[") != -1)
        item.options = JSON.parse(item.options);
      if (item.answer != null) {
        if (item.answer.indexOf("[") != -1) item.answer = JSON.parse(item.answer);
        else if (item.answer.indexOf("1") == 0 && item.answer.length == 13)
          item.answer = parseInt(item.answer);
      }
      this.form = {
        show: true,
        loading: false,
        ...item,
      };
      this.getQuestionNumber();
    },
    getQuestionNumber() {
      this.page = 0;
      this.number = 0;
      this.list = [];
      question
        .getNumber(this.form.sid, null)
        .then((res) => {
          this.number = res.num;
          if (res.num > 0) {
            this.page = 1;
            this.getQuestionList();
          } else {
            window.$message.warning("未找到可用试题");
          }
        })
        .catch(() => {});
    },
    getQuestionList() {
      question
        .getList(this.form.sid, null, this.page, 10)
        .then((res) => {
          if (res.list) {
            this.list = res.list;
          } else {
            window.$message.warning(res.message ? res.message : "发生意料之外的错误");
          }
        })
        .catch(() => {});
    },
    addQuestion(item) {
      this.form.questions.push(item);
    },
    delQuestion(index) {
      this.form.questions.splice(index, 1);
    },
    submit() {
      this.$refs.form.validate((errors) => {
        if (!errors) {
          let form = JSON.parse(JSON.stringify(this.form));
          if (this.form.questions.length == 0) {
            window.$message.warning("试卷卷面不能为空");
            return false;
          }
          this.form.loading = true;
          form.questions = JSON.stringify(form.questions);
          if (this.form.id) this.submitEdit(form);
          else this.submitAdd(form);
        }
      });
    },
    submitAdd(form) {
      exam
        .add(form.name, form.sid, form.questions)
        .then((res) => {
          this.form.loading = false;
          if (res.state) {
            window.$message.success("考试添加成功");
            this.form.show = false;
            this.$emit("update", "add");
          } else window.$message.warning(res.message ? res.message : "考试添加失败");
        })
        .catch(() => {
          this.form.loading = false;
        });
    },
    submitEdit(form) {
      exam
        .edit(form.id, form.name, form.sid, form.questions)
        .then((res) => {
          this.form.loading = false;
          if (res.state) {
            window.$message.success("考试编辑成功");
            this.form.show = false;
            this.$emit("update", "edit");
          } else window.$message.warning(res.message ? res.message : "考试编辑失败");
        })
        .catch(() => {
          this.form.loading = false;
        });
    },
  },
};
</script>
<style scoped>
.question-list {
  border-radius: 8px;
}

.question-item {
  background-color: #212126;
  cursor: pointer;
}

.question-item:hover {
  background-color: #121214;
}
</style>
