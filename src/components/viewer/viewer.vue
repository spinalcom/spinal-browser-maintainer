<template>
  <div class="viewerContainer"
       id="autodesk_forge_viewer">

  </div>

</template>


<script>
// import Vue from "vue";
import ForgeViewer from "./forgeViewer";
import { EventBus } from "../../config/event";

import dataService from "../../config/data";
import { setTimeout } from "timers";

let forgeViewer = new ForgeViewer();

export default {
  name: "appViewer",
  // props: ["collapseMenu"],
  data() {
    return {
      viewer: null
    };
  },
  async mounted() {
    this.getEvents();

    await forgeViewer.start_viewer(
      document.getElementById("autodesk_forge_viewer")
    );
    this.viewer = forgeViewer.viewer;
  },
  methods: {
    getEvents() {
      EventBus.$on("click-event", item => {
        this.isolateObjects(item.id);
      });

      EventBus.$on("mouse-over", item => {
        this.selectObjects(item.id);
      });

      EventBus.$on("select-equipment", itemId => 
      {
        this.selectObjects(itemId);
      });

      EventBus.$on("mouse-leave", () => {
        this.viewer.select();
      });

      EventBus.$on("click-room", item => {
        this.zoomObjects(item);
      });
    },
    selectObjects(id) {
      dataService.getBimObjects(id).then(res => {
        this.viewer.select(res);
      });
    },
    zoomObjects(id) {
      let selection = this.viewer.getSelection();
      
      setTimeout(() => {
        this.viewer.fitToView(selection);
      }, 1)
      this.viewer.fitToView([selection]);
      
      // dataService.getBimObjects(id).then(res => {
      //   this.viewer.fitToView(res);
      // })
    },
    isolateObjects(id) {
      dataService
        .getBimObjects(id)
        .then(res => {
          this.viewer.isolate(res);
          this.viewer.fitToView(res);
          return;
        })
        // .then(() => {
        //   setTimeout(() => {
        //     this.viewer.setViewCube("[front,]");
        //   }, 1000);
        // });
    },

    setCameraToTopView() {}
  }
};
</script>

<style scoped>
/* .mainLayout {
  width: calc(100% - 50px);
  position: relative;
  -webkit-transition-duration: 0.3s;

  margin-left: 50px;
}

.mainLayout.collapsed {
  width: calc(100% - 350px);
  margin-left: 350px;
}
*/
.viewerContainer {
  width: 79%;
  height: calc(47%);
  position: relative;
  float: right;
}

@media screen and (max-width: 900px) {
  #autodesk_forge_viewer {
    width: 100%;
    height: calc(60%);
    padding: 0px;
    margin-top: 10px;
    display: block;
  }
}
</style>
