<template>
  <div v-if="data"
       class="container-fluid">

    <app-sidebar :floors="data.floors"
                 @selectFloor="selecFloor"></app-sidebar>

    <app-main :collapsed="collapseMenu"
              :floorSelected="floorSelected"
              :rooms="data.rooms"
              :equipments="data.equipments"></app-main>

  </div>
</template>

<script>
import Vue from "vue";
import sidebar from "./components/sidebar/sidebar.vue";
import MainContainer from "./components/container/container.vue";
import dataService from "./config/data";

export default Vue.extend({
  data() {
    return {
      collapseMenu: false,
      data: null,
      floorSelected: null
    };
  },
  components: {
    "app-sidebar": sidebar,
    "app-main": MainContainer
  },
  created() {
    dataService.getAllData().then(allData => {
      this.data = allData;
    });
  },

  methods: {
    mounted() {},
    onCollapsed(value) {
      this.collapseMenu = value;
    },
    selecFloor(id) {
      this.floorSelected = id;
    }
  }
});
</script>

<style scoped>
.container-fluid {
  width: calc(100%);
  height: calc(100%);
}
</style>
