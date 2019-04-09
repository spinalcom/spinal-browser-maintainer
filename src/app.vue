<template>
  <div class="container-fluid">
    <app-sidebar :collapseMenu="collapseMenu"
                 @collapsed="onCollapsed"></app-sidebar>

    <!-- <app-rooms></app-rooms> -->
    <app-main :collapsed="collapseMenu"></app-main>
    <vue-ins-progress-bar></vue-ins-progress-bar>

  </div>
</template>

<script>
import Vue from "vue";
import sidebar from "./components/sidebar/sidebar.vue";
import PageOptions from "./config/PageOptions";
import MainContainer from "./components/container/container.vue";

export default Vue.extend({
  data() {
    return {
      collapseMenu: false
    };
  },
  components: {
    "app-sidebar": sidebar,
    "app-main": MainContainer
  },
  created() {
    PageOptions.pageBodyScrollTop = window.scrollY;

    window.addEventListener("scroll", this.handleScroll);

    this.$insProgress.start();

    // this.$router.beforeEach((to, from, next) => {
    // this.$insProgress.start();
    // next();
    // });
  },
  methods: {
    mounted() {
      this.$insProgress.finish();
      console.log("mounted app.vue");
    },
    created() {
      console.log("created app.vue");
    },
    onCollapsed(value) {
      console.log("collapsed");

      this.collapseMenu = value;
    }
  }
});
</script>

<style scoped>
.container-fluid {
  height: calc(100%);
}
</style>
