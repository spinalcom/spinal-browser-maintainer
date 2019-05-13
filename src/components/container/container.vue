
<template>
  <div class="container">
    <app-header></app-header>
    <vs-row class="row mainRow">
      <contextual-list :floorSelected="floorSelected"
                     :rooms="rooms"
                     :equipments="equipments"></contextual-list>
      <app-viewer></app-viewer>
    <middle-bar></middle-bar>
    <data-view :allData="allData">
    </data-view>
    </vs-row>
  </div>
</template>

<script>
import appViewer from "../viewer/viewer.vue";
import Header from "../header/header.vue";
import Rooms from "../rooms/rooms.vue";
import MiddleBar from "../middlebar/middlebar.vue";
import DataView from "../dataview/dataview.vue";
import contextualList from "../contextualList/contextualList.vue";

export default {
  name: "MainContainer",
  props: ["collapsed", "floorSelected", "rooms", "equipments", "allData"],
  components: {
    "app-header": Header,
    "rooms-sidebar": Rooms,
    "app-viewer": appViewer,
    MiddleBar,
    DataView,
    contextualList
  },
  computed: {
    getStyle() {
      if (this.collapsed) {
        return {};
      } else {
        return {
          width: "calc(100% - 350px)",
          background: "black"
        };
      }
    }
  }
  // watch : {
  //   floorSelected : function(newValue,oldValue) {

  //   }
  // }
};
</script>

<style scoped>
.container {
  position: relative;
  min-height: calc(100%);
  float: right;
  width: calc(100% - 50px);
  /* width: calc(100%); */
  height: calc(100%);
}

/* @media screen and (min-width: 900px) {
  .mainContainer:not(.collapsed) {
    width: calc(100% - 350px);
    height: (100%);
  }
} */

.mainRow {
  margin: 0px;
  height: calc(100vh - 40px);
}
</style>
