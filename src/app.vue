<template>
  <div v-if="data"
       class="container-fluid">
    <app-header></app-header>

    <app-sidebar 
                class="sidebarContext-display"
                :floors="data.floors"
                @selectFloor="selecFloor"
                :rooms=data.rooms ></app-sidebar>

     <!--  <contextual-list class="roomcontext"
                     :floorSelected="floorSelected"
                     :rooms="data.rooms"
                     :equipments="data.equipments"></contextual-list> -->
      <app-viewer ></app-viewer>

      <ticket-data class="dataViewDisplay"
                   :allData="data" ></ticket-data>


    <!-- ?? <app-main :collapsed="collapseMenu" -->
<!--           :floorSelected="floorSelected"
          :rooms="data.rooms"
          :equipments="data.equipments"
          :allData="data"></app-main> -->

<!--      <sidebar-context class="sidebarContext-display">
    </sidebar-context>
  
     <sidebar-category class="sidebarContext-display">
    </sidebar-category>  -->

    <!-- <data-view :allData="allData" class="dataViewDisplay"></data-view> -->


  </div>
</template>

<script>
import Vue from "vue";
import appViewer from "./components/viewer/viewer.vue";
import appHeader from "./components/header/header.vue";
import sidebar from "./components/sidebar/sidebar.vue";
import ticketData from "./components/ticketComponent/ticketData.vue";
import sidebarContext from "./components/sidebar/sidebarContext.vue";
import sidebarCategory from "./components/sidebar/sidebarCategory.vue";
import DataView from "./components/dataview/dataview.vue";
import MiddleBar from "./components/middlebar/middlebar.vue";
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
    appViewer,
    DataView,
    sidebarProcess,
    MiddleBar,
    appHeader,
    ticketData
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
.roomcontext {
  position: absolute;
  /*min-height: calc(100%);*/
  margin-left: 11%;
  width: calc(16%);
}
.container-fluid {
  width: calc(100%);
  height: calc(100%);
  font-family: sans-serif;
}

.sidebarContext-display {
  position:absolute;
  display: block;
}
.dataViewDisplay {
  margin-left: calc(160px + 51.4%);
  background-color: rgba(1,2,1,0);
  height: 93%;
  width: 38%;
/*  margin-left: 11%;
  background-color: rgba(1,2,1,0);
  display: inline;
  height: 46%;
  width: 74%;
*/}
</style>
