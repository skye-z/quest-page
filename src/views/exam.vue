<template>
  <div class="no-select">
    <loading ref="loading" />
    <head-bar :app="app" :user="user" :subjects="subjects" @update="selectSubject" />
    <div class="app-body">
      <div class="tips text-center" v-if="subject == 0">
        <n-icon class="mr-5" size="100">
          <Warning24Filled />
        </n-icon>
        <div>请先在左上方选择科目</div>
      </div>
      <div class="tips text-center" v-else-if="exams.length == 0">
        <n-result status="404" title="空空如也" description="这个科目下面似乎没有试卷呀">
          <template #footer>
            <n-button @click="getExamList">重新获取</n-button>
          </template>
        </n-result>
      </div>
      <div v-else class="exam-list">
        <div v-for="item in exams" class="exam-item" @click="startExam(item)">
          <div class="line1">{{ item.name }}</div>
          <div>
            <n-text depth="3">
              {{ item.questions.length }}题
              <n-ellipsis class="ml-10" style="max-width: 190px"
                >#{{ item.subject }}</n-ellipsis
              >
            </n-text>
          </div>
        </div>
      </div>
    </div>
    <foot-bar :app="app" />
  </div>
</template>

<script>
import Loading from "../components/loading.vue";
import HeadBar from "../components/headBar.vue";
import FootBar from "../components/footBar.vue";
import { Warning24Filled } from "@vicons/fluent";
import { subject, exam } from "../plugins/api";
import { init, getSubjectList } from "../plugins/common";

export default {
  name: "Exam",
  components: { Loading, HeadBar, FootBar, Warning24Filled },
  data: () => ({
    app: {
      name: "Quest云题库"
    },
    user: {},
    exams: [],
    subject: 0,
    subjects: [],
  }),
  methods: {
    jump(name) {
      this.$router.push("/" + name);
    },
    selectSubject(value) {
      this.subject = value;
      this.getExamList();
    },
    getExamList() {
      this.exams = [];
      this.$refs.loading.show();
      exam
        .getList(this.subject)
        .then((res) => {
          for (let i in res.list) {
            res.list[i].questions = JSON.parse(res.list[i].questions);
            res.list[i].subject = this.getSubject(res.list[i].sid);
          }
          this.exams = res.list;
          this.$refs.loading.hide();
        })
        .catch(() => {
          this.$refs.loading.hide();
        });
    },
    getSubject(sid) {
      for (let i in this.subjects) {
        if (this.subjects[i].value == sid) return this.subjects[i].label;
      }
      return "未知科目";
    },
    startExam(item) {
      let cache = localStorage.getItem("app:exam:" + item.id);
      if (cache == undefined) {
        window.$dialog.warning({
          title: "考前须知",
          content:
            "模拟考试不设监考、不限时间、不限次数, 请自觉遵守考试诚信原则, 考试结果与分数不上传, 是否开始《" +
            item.name +
            "》考试?",
          positiveText: "开始考试",
          negativeText: "取消",
          onPositiveClick: () => {
            item.answer = {};
            item.start = new Date().getTime();
            localStorage.setItem("app:exam:" + item.id, JSON.stringify(item));
            window.$message.success("考试开始,考试结果将存储于本机");
            this.$router.push("/exam/" + item.id);
          },
        });
      } else {
        window.$dialog.warning({
          title: "恢复考试",
          content: "系统检测到本机存在进行中的《" + item.name + "》考试, 是否继续考试?",
          positiveText: "继续考试",
          negativeText: "重新开始",
          onPositiveClick: () => {
            window.$message.success("考试已恢复");
            this.$router.push("/exam/" + item.id);
          },
          onNegativeClick: () => {
            item.answer = {};
            item.start = new Date().getTime();
            localStorage.setItem("app:exam:" + item.id, JSON.stringify(item));
            window.$message.success("考试开始,考试结果将存储于本机");
            this.$router.push("/exam/" + item.id);
          },
        });
      }
    },
  },
  mounted() {
    init(this);
    getSubjectList(this, subject);
  },
};
</script>

<style scoped>
.tips {
  padding-top: 30vh;
  font-size: 24px;
  width: 100%;
}

.exam-list {
  padding: 0 10px;
  align-items: center;
  flex-wrap: wrap;
  display: flex;
}

.exam-item {
  transition: all 0.3s ease-in;
  border-radius: 12px;
  margin-right: 10px;
  max-width: 230px;
  cursor: pointer;
  padding: 10px;
  width: 100%;
}

.exam-item:hover {
  background-color: #2a3546;
}

.exam-item:active {
  background-color: #151d29;
}
</style>
