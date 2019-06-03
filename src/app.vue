<template>
  <div v-if="data"
       class="container-fluid">

    <app-sidebar :floors="data.floors"
                 @selectFloor="selecFloor"></app-sidebar>

    <app-sidebar 
    class="sidebarContext-display"
    :floors="data.floors"
                 @selectFloor="selecFloor"></app-sidebar>

    <sidebar-context class="sidebarContext-display">
    </sidebar-context>
  
    <sidebar-category class="sidebarContext-display">
    </sidebar-category>

    <sidebar-process class="sidebarContext-display">
    </sidebar-process>

    <app-main :collapsed="collapseMenu"
              :floorSelected="floorSelected"
              :rooms="data.rooms"
              :equipments="data.equipments"
              :allData="data"></app-main>

  </div>
</template>

<script>
import Vue from "vue";
import sidebar from "./components/sidebar/sidebar.vue";
import sidebarContext from "./components/sidebar/sidebarContext.vue";
import sidebarCategory from "./components/sidebar/sidebarCategory.vue";
import sidebarProcess from "./components/sidebar/sidebarElement.vue";
import MainContainer from "./components/container/container.vue";
import dataService from "./config/data";
import contextualList from "./components/contextualList/contextualList.vue";

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
    "app-main": MainContainer,
    contextualList,
    sidebarContext,
    sidebarCategory,
    sidebarProcess
  },
  created() {
    let self = this;
    dataService.getAllData().then(allData => {
      self.data = allData;
    });
    setTimeout(function() {
      console.log(self.data.rooms);
  }, 2000)
  },
  methods: {
    mounted() {},
    onCollapsed(value) {
      this.collapseMenu = value;
    },
    selecFloor(id) {
      let self = this;
      this.data.floors.forEach(function(el) {
        if (el.id === id)
          self.floorSelected = el.name;
      });
      //console.log(id, "== id, data", this.data);
      //this.floorSelected = id;
    }
  }
});
</script>

<style scoped>
.container-fluid {
  width: calc(100%);
  height: calc(100%);
  font-family: sans-serif;
}

.sidebarContext-display {
  position:absolute;
  display: block;
}
</style>
