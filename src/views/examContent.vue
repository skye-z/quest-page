<template>
  <div class="no-select">
    <loading ref="loading" />
    <head-bar :app="app" :user="user" />
    <div class="app-body">
      <div class="tips text-center" v-if="id == 0">
        <n-icon class="mr-5" size="100">
          <Warning24Filled />
        </n-icon>
        <div>考试项目不存在</div>
      </div>
      <div v-else>考试内容</div>
    </div>
    <foot-bar :app="app" />
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
      name: "Quest云题库",
      version: "1.0.0",
    },
    id: 0,
    info: {},
    user: {},
  }),
  methods: {
    initExam(id) {
      let cache = localStorage.getItem("app:exam:" + id);
      if (cache != undefined) {
        this.id = id;
        this.info = JSON.parse(cache);
        document.title = this.info.name + " - " + this.app.name;
      }
    },
  },
  mounted() {
    init(this);
    let id = this.$route.params.id;
    if (id) this.initExam(id);
    this.$refs.loading.hide();
  },
};
</script>

<style scoped>
.tips {
  padding-top: 30vh;
  font-size: 24px;
  width: 100%;
}
</style>
