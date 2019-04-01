<template>
<div>
  <app-sidebar></app-sidebar>
</div>
</template>

<script>
import Vue from "vue";
import sidebar from "./components/sidebar/sidebar.vue";

export default Vue.extend({
  data() {
    return {

    }
  },
  components: {
    "app-sidebar": sidebar
  },
  methods: {
    mounted() {
      console.log("mounted app.vue");
    },
    created() {
      console.log("created app.vue");
    }
  }
});
</script>