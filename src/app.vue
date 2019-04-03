<template>
  <div>
    <app-sidebar :collapseMenu="collapseMenu"
                 @collapsed="onCollapsed"></app-sidebar>
    <app-viewer :collapseMenu="collapseMenu"></app-viewer>
  </div>
</template>

<script>
import Vue from "vue";
import sidebar from "./components/sidebar/sidebar.vue";
import graphserv from "./config/GraphService";
import appViewer from "./components/viewer/viewer.vue";

// graphserv.getContext("geo");
export default Vue.extend({
  data() {
    return {
      collapseMenu: false
    };
  },
  components: {
    "app-sidebar": sidebar,
    "app-viewer": appViewer
  },
  methods: {
    mounted() {
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