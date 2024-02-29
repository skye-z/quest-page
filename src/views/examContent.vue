<template>
  <div class="no-select">
    <loading ref="loading" />
    <head-bar :app="app" :user="user" :exam="info.name" />
    <div class="app-body">
      <div class="tips text-center" v-if="id == 0">
        <n-icon class="mr-5" size="100">
          <Warning24Filled />
        </n-icon>
        <div>考试项目不存在</div>
      </div>
      <div v-else style="position: relative">
        <div class="tool full-width" :class="{ 'tool-flex': flex }">
          <div class="card pa-10 mb-10">
            <div>开始时间: <n-time :time="info.start" /></div>
            <div v-if="info.end">结束时间: <n-time :time="info.end" /></div>
            <div>考察科目: {{ info.subject }}</div>
            <div>考题数量: {{ info.questions.length }}题</div>
          </div>
          <div class="state-list card mb-10">
            <div
              class="state-item"
              v-for="(item, index) in info.questions"
              :class="{
                done: state[item.id] == 1,
                correct: state[item.id] == 2,
                incorrect: state[item.id] == 3,
              }"
            >
              {{ index + 1 }}
            </div>
          </div>
          <div class="foot">
            <n-button v-if="stop" class="full-width" type="error" @click="exitExam"
              >退出</n-button
            >
            <div class="flex align-center justify-between" v-else>
              <n-button type="error" tertiary @click="exitExam">退出</n-button>
              <n-button type="primary" style="width: 200px" @click="submit"
                >交卷</n-button
              >
            </div>
            <foot-bar :app="app" />
          </div>
        </div>
        <div class="question-list">
          <div class="question-item card mb-10" v-for="(item, i) in info.questions">
            <div class="float-right flex align-center">
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
            <div class="question-title">{{ i + 1 }}. {{ item.question }}</div>
            <template v-if="item.type == 1">
              <n-radio-group
                class="mt-10"
                v-model:value="info.answer[item.id]"
                @update:value="updateState(item.id)"
                :name="'options-' + item.id"
                :disabled="stop"
              >
                <n-radio
                  class="full-width"
                  v-for="opt in item.options"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </n-radio>
              </n-radio-group>
            </template>
            <template v-else-if="item.type == 2">
              <n-checkbox-group
                class="mt-10"
                v-model:value="info.answer[item.id]"
                @update:value="updateState(item.id)"
                :name="'options-' + item.id"
                :disabled="stop"
              >
                <n-checkbox
                  class="full-width"
                  v-for="opt in item.options"
                  :key="opt.value"
                  :value="opt.value"
                  :label="opt.label"
                />
              </n-checkbox-group>
            </template>
            <template v-else-if="item.type == 3">
              <n-radio-group
                class="mt-10"
                v-model:value="info.answer[item.id]"
                @update:value="updateState(item.id)"
                :name="'options-' + item.id"
                :disabled="stop"
              >
                <n-radio-button value="1"> 正确 </n-radio-button>
                <n-radio-button value="0"> 错误 </n-radio-button>
              </n-radio-group>
            </template>
            <template v-else-if="item.type == 4">
              <div class="question-ops">
                <n-input
                  v-for="(_sub, index) in item.answer"
                  v-model:value="info.answer[item.id][index]"
                  @update:value="updateState(item.id)"
                  :disabled="stop"
                  :placeholder="'请输入第 ' + (index + 1) + ' 空'"
                  class="mr-10 mt-10"
                  style="width: 200px"
                />
              </div>
            </template>
            <template v-else-if="item.type == 5">
              <div class="flex align-center" style="flex-wrap: wrap">
                <div
                  class="flex align-center mr-10 mt-10"
                  v-for="(opt, index) in item.answer"
                >
                  <div class="mr-10">{{ opt }}:</div>
                  <n-select
                    v-model:value="info.answer[item.id][index]"
                    @blur="updateState(item.id)"
                    :options="item.options"
                    :disabled="stop"
                    style="width: 200px"
                  />
                </div>
              </div>
            </template>
            <template v-else-if="item.type == 6 || item.type == 7 || item.type == 8">
              <n-input
                class="mt-10"
                v-model:value="info.answer[item.id]"
                @update:value="updateState(item.id)"
                :disabled="stop"
                type="textarea"
                placeholder="请在此处输入答案"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "../components/loading.vue";
import HeadBar from "../components/headBar.vue";
import FootBar from "../components/footBar.vue";
import { Warning24Filled } from "@vicons/fluent";
import { init } from "../plugins/common";

export default {
  name: "Exam",
  components: { Loading, HeadBar, FootBar, Warning24Filled },
  data: () => ({
    app: {
      name: "Quest云题库"
    },
    id: 0,
    info: {},
    user: {},
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
    state: {},
    flex: true,
    stop: false,
    timer: 0,
  }),
  methods: {
    initEvent() {
      window.addEventListener(
        "scroll",
        () => {
          let top = document.documentElement.scrollTop || document.body.scrollTop;
          this.flex = top < 61;
        },
        true
      );
    },
    initExam(id) {
      let cache = localStorage.getItem("app:exam:" + id);
      if (cache != undefined) {
        this.id = id;
        this.state = {};
        cache = JSON.parse(cache);
        if (cache.answer == undefined) cache.answer = {};
        else {
          for (let i in cache.answer) {
            this.updateState(i);
          }
        }
        for (let i in cache.questions) {
          let item = cache.questions[i];
          if (item.options.indexOf("[") != -1) item.options = JSON.parse(item.options);
          if (item.answer.indexOf("[") != -1) item.answer = JSON.parse(item.answer);
          if (item.type == 4 || item.type == 5) {
            let ops = [];
            for (let x in item.options) {
              ops.push({
                label: item.options[x],
                value: x,
              });
            }
            item.options = ops;
          }
        }
        this.initEvent();
        this.info = cache;
        document.title = this.info.name + " - " + this.app.name;
      }
    },
    updateState(id) {
      this.state[id] = 1;
      this.autoSave();
    },
    autoSave() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        localStorage.setItem("app:exam:" + this.id, JSON.stringify(this.info));
      }, 1000);
    },
    exitExam() {
      window.$dialog.warning({
        title: "退出考试",
        content: this.stop
          ? "考试已结束, 退出考试后不会保存答题结果, 确认要退出吗?"
          : "模拟考试不设监考、不限时间、不限次数, 退出后下次进入可恢复考试, 确认要退出吗?",
        positiveText: "确认",
        negativeText: "取消",
        onPositiveClick: () => {
          if (this.stop) localStorage.removeItem("app:exam:" + this.id);
          this.$refs.loading.show();
          setTimeout(() => {
            this.$router.push("/exam");
          }, 300);
        },
      });
    },
    submit() {
      let title = "二次确认";
      let content =
        "所有试题均已作答, 交卷后将立即批改处分, 答题结果与分数不上传, 是否继续交卷?";
      let num = this.info.questions.length - Object.keys(this.state).length;
      if (num != 0) {
        title = "试题遗漏";
        content = "系统检测到有" + num + "道题未作答, 是否继续交卷?";
      }
      window.$dialog.warning({
        title,
        content,
        positiveText: "继续交卷",
        negativeText: "取消",
        onPositiveClick: () => {
          this.checkExam();
        },
      });
    },
    checkExam() {
      this.stop = true;
      this.info.end = new Date().getTime();
      let answer = this.info.answer;
      for (let i in this.info.questions) {
        let item = this.info.questions[i];
        if (answer[item.id] == undefined) continue;

        if (item.type == 1 || item.type == 3) {
          this.state[item.id] = item.answer == answer[item.id] ? 2 : 3;
        } else if (item.type == 2) {
          let value = answer[item.id];
          if (item.answer.length != Object.keys(value).length) {
            this.state[item.id] = 3;
            continue;
          }

          let allState = true;
          for (let x in item.answer) {
            let state = false;
            for (let y in value) {
              if (item.answer[x] == value[y]) {
                state = true;
                break;
              }
            }
            if (!state) allState = false;
          }
          this.state[item.id] = allState ? 2 : 3;
        } else if (item.type == 4) {
          let value = answer[item.id];
          if (item.answer.length != Object.keys(value).length) {
            this.state[item.id] = 3;
            continue;
          }

          let pass = true;
          for (let i in item.answer) {
            if (item.answer[i] != value[i]) pass = false;
          }
          this.state[item.id] = pass ? 2 : 3;
        } else if (item.type == 5) {
          let value = answer[item.id];
          if (Object.keys(value).length != item.answer.length) {
            this.state[item.id] = 3;
            continue;
          }
          let pass = true;
          for (let i in value) {
            if (value[i] != item.options[i].value) pass = false;
          }
          this.state[item.id] = pass ? 2 : 3;
        } else if (item.type == 6 || item.type == 7) {
          let value = answer[item.id];
          if (value.length <= 10) {
            this.state[item.id] = 3;
            continue;
          }
          let num = 0;
          for (let i in item.answer) {
            if (value.indexOf(item.answer[i]) != -1) num++;
          }
          this.state[item.id] = num == item.answer.length ? 2 : 3;
        } else if (item.type == 8) {
          let value = answer[item.id];
          this.state[item.id] = value.length >= parseInt(item.answer) ? 2 : 3;
        }
      }
    },
  },
  mounted() {
    init(this);
    let id = this.$route.params.id;
    if (id) this.initExam(id);
    setTimeout(() => {
      this.$refs.loading.hide();
    }, 300);
  },
};
</script>

<style scoped>
.tips {
  padding-top: 30vh;
  font-size: 24px;
  width: 100%;
}

.tool {
  max-width: 390px;
  position: fixed;
  z-index: 9999;
  top: 10px;
}

.tool-flex {
  position: absolute;
  top: 0;
}

.state-list {
  padding: 10px 0 0 10px;
  align-items: center;
  flex-wrap: wrap;
  display: flex;
}

.state-item {
  background-color: #2a3546;
  justify-content: center;
  margin: 0 10px 10px 0;
  align-items: center;
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  height: 28px;
  width: 28px;
}

.state-item.done {
  color: #3ae6ac;
}

.state-item.correct {
  border: 1px solid #3ae6ac;
  color: #3ae6ac;
  height: 26px;
  width: 26px;
}

.state-item.incorrect {
  border: 1px solid #ff1e1e;
  color: #ff4343;
  height: 26px;
  width: 26px;
}

.question-list {
  padding-left: 400px;
  position: absolute;
  max-width: 600px;
  z-index: 9;
  top: 0px;
}

.question-item {
  padding: 10px;
}

.question-title {
  font-weight: 600;
  font-size: 16px;
}

.question-ops {
  align-items: center;
  flex-wrap: wrap;
  display: flex;
}

@media (max-width: 768px) {
  .exam-box {
    display: block;
  }

  .tool,
  .tool-flex {
    position: relative;
    top: 0;
  }

  .question-list {
    position: relative;
    padding: 0 0 80px 0;
  }

  .foot {
    border-top: #556276 1px solid;
    background-color: #1f2937;
    padding: 10px 10px 0 10px;
    width: calc(100% - 20px);
    position: fixed;
    bottom: 0px;
    left: 0;
  }
}
</style>
