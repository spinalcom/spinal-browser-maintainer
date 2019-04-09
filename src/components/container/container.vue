
<template>
  <div class="mainContainer"
       :class="{'collapsed' : collapsed }">
    <app-header></app-header>
    <div class="row mainRow">
      <rooms-sidebar></rooms-sidebar>
      <app-viewer></app-viewer>
    </div>
  </div>
</template>

<script>
import appViewer from "../viewer/viewer.vue";
import Header from "../header/header.vue";
import Rooms from "../rooms/rooms.vue";

export default {
  name: "MainContainer",
  props: ["collapsed"],
  components: {
    "app-header": Header,
    "rooms-sidebar": Rooms,
    "app-viewer": appViewer
  },
  data() {
    return {};
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
};
</script>

<style scoped>
.mainContainer {
  -webkit-transition-duration: 0.3s;
  position: relative;
  min-height: calc(100%);
  float: right;
  width: calc(100% - 50px);
  /* width: calc(100%); */
  height: calc(100%);
}

@media screen and (min-width: 900px) {
  .mainContainer:not(.collapsed) {
    width: calc(100% - 350px);
    height: (100%);
  }
}

.mainRow {
  margin: 0px;
  height: calc(50%);
}
</style>
