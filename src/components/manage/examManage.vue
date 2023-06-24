<template>
  <div>
    <div class="card mb-10">
      <n-button
        @click="openForm()"
        class="float-right mt-5 mr-5"
        size="small"
        type="primary"
        round
      >
        <template #icon>
          <n-icon>
            <AddCircle24Regular />
          </n-icon>
        </template>
        添加
      </n-button>
      <div class="card-name">考试</div>
      <n-spin :show="loading">
        <n-scrollbar style="height: 295px">
          <div
            class="exam-item flex align-center justify-between"
            v-for="item in list"
            @click="openForm(item)"
          >
            <div>
              <div class="line1">{{ item.name }}</div>
              <n-text depth="3">
                {{ item.questions.length }}题
                <n-ellipsis class="ml-10" style="max-width: 190px"
                  >#{{ item.subject }}</n-ellipsis
                >
              </n-text>
            </div>
            <n-button @click.stop="remove(item.id)" strong secondary circle type="error">
              <template #icon>
                <n-icon>
                  <DeleteForeverRound />
                </n-icon>
              </template>
            </n-button>
          </div>
        </n-scrollbar>
      </n-spin>
    </div>
    <exam-form ref="form" :subjects="subjects" :type="type" @update="update" />
  </div>
</template>
<script>
import { DeleteForeverRound, CheckRound, SearchRound } from "@vicons/material";
import { AddCircle24Regular } from "@vicons/fluent";
import ExamForm from "../modal/examForm.vue";
import { exam } from "../../plugins/api";
export default {
  components: {
    ExamForm,
    DeleteForeverRound,
    CheckRound,
    SearchRound,
    AddCircle24Regular,
  },
  props: {
    subjects: {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    loading: true,
    list: [],
    type: [
      {
        label: "单选题",
        value: 1,
      },
      {
        label: "多选题",
        value: 2,
      },
      {
        label: "判断题",
        value: 3,
      },
      {
        label: "填空题",
        value: 4,
      },
      {
        label: "对号题",
        value: 5,
      },
      {
        label: "简答题",
        value: 6,
      },
      {
        label: "论述题",
        value: 7,
      },
      {
        label: "作文题",
        value: 8,
      },
    ],
  }),
  methods: {
    getList() {
      this.loading = true;
      exam
        .getList()
        .then((res) => {
          if (res.list) {
            for (let i in res.list) {
              res.list[i].questions = JSON.parse(res.list[i].questions);
              res.list[i].subject = this.getSubject(res.list[i].sid);
            }
            setTimeout(() => {
              this.list = res.list;
              this.loading = false;
            }, 500);
          } else {
            window.$message.warning(res.message ? res.message : "发生意料之外的错误");
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getSubject(sid) {
      for (let i in this.subjects) {
        if (this.subjects[i].value == sid) return this.subjects[i].label;
      }
      return "未知科目";
    },
    openForm(item) {
      if (item) this.$refs.form.edit(item);
      else this.$refs.form.add();
    },
    update() {
      this.getList();
    },
    remove(id) {
      window.$dialog.warning({
        title: "操作确认",
        content: "确认要删除此考试?",
        positiveText: "确认",
        negativeText: "取消",
        onPositiveClick: () => {
          exam
            .remove(id)
            .then((res) => {
              if (res.state) {
                window.$message.success("删除成功");
                this.getList();
              } else window.$message.warning(res.message ? res.message : "删除失败");
            })
            .catch(() => {
              this.form.loading = false;
            });
        },
      });
    },
  },
  mounted() {
    setTimeout(() => {
      this.getList();
    }, 500);
  },
};
</script>
<style scoped>
.exam-item {
  border-top: #556276 1px solid;
  cursor: pointer;
  padding: 10px;
}

.exam-item:hover {
  background-color: #45546a;
}
</style>
