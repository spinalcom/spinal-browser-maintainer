<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div v-if="data"
       class="container-fluid">
    <!-- eslint-disable-next-line vue/html-self-closing -->
    <app-header @onViewerHide="onViewerHide"
                @onTicketsHide="onTicketsHide"></app-header>
    <div class="main-content"
         data-app>
      <div class="sidebarContext-display">
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <app-sidebar :floors="data.floors"
                     :rooms="data.rooms"
                     :all-data="data"
                     @selectFloor="selecFloor"></app-sidebar>
      </div>
      <div class="view-container">
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <app-viewer ref="appViewer"
                    class="app-viewer-display"
                    :class="{dataViewHide: hideTickets,viewerHide:viewerHide}">
        </app-viewer>

        <!-- eslint-disable-next-line vue/html-self-closing -->
        <ticket-data class="dataViewDisplay"
                     :class="{dataViewHide: hideTickets, viewerHide:viewerHide}"
                     :all-data="data"></ticket-data>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "./config/event";
import Vue from "vue";
import appViewer from "./components/viewer/viewer.vue";
import appHeader from "./components/header/header.vue";
import sidebar from "./components/sidebar/sidebar.vue";
import ticketData from "./components/ticketComponent/ticketData.vue";
// import sidebarContext from "./components/sidebar/sidebarContext.vue";
// import sidebarCategory from "./components/sidebar/sidebarCategory.vue";
// import DataView from "./components/dataview/dataview.vue";
// import MiddleBar from "./components/middlebar/middlebar.vue";
// import sidebarProcess from "./components/sidebar/sidebarElement.vue";
// import MainContainer from "./components/container/container.vue";
import dataService from "./config/data";
// import contextualList from "./components/contextualList/contextualList.vue";

export default Vue.extend({
  components: {
    "app-sidebar": sidebar,
    // "app-main": MainContainer,
    // contextualList,
    // sidebarContext,
    // sidebarCategory,
    appViewer,
    // DataView,
    // sidebarProcess,
    // MiddleBar,
    appHeader,
    ticketData
  },
  data() {
    return {
      collapseMenu: false,
      data: null,
      floorSelected: null,
      test: {},
      bindObj: [],
      hideTickets: false,
      viewerHide: false
    };
  },
  created() {
    let self = this;
    dataService.getAllData().then(allData => {
      self.data = allData;
      self.bindAllData();
    });
  },
  methods: {
    mounted() {
      console.log(this.data);
    },
    bindAllData() {
      let self = this;
      // console.log("binding", dataService.ContextNode, dataService.ProcessNodes, dataService.StepsNodes);

      this.bindObj.push(dataService.ContextNode);
      this.bindObj.push(
        dataService.ContextNode.bind(function() {
          self.refreshBind();
          dataService.getAllData().then(allData => {
            self.updateData(allData);
            EventBus.$emit("data-update");
            //self.data = allData;
          });
        }, false)
      );

      for (var ProcessNode in dataService.ProcessNodes) {
        this.bindObj.push(dataService.ProcessNodes[ProcessNode]);
        this.bindObj.push(
          dataService.ProcessNodes[ProcessNode].bind(function() {
            self.refreshBind();
            dataService.getAllData().then(allData => {
              self.updateData(allData);
              EventBus.$emit("data-update");
              //self.data = allData;
            });
          }, false)
        );
      }

      for (var Node in dataService.StepsNodes) {
        this.bindObj.push(dataService.StepsNodes[Node]);
        this.bindObj.push(
          dataService.StepsNodes[Node].bind(function() {
            self.refreshBind();
            dataService.getAllData().then(allData => {
              self.updateData(allData);
              EventBus.$emit("data-update");
              //self.data = allData;
            });
          }, false)
        );
      }

      setTimeout(function() {
        //     console.log("binobj = ", self.bindObj);
      }, 2000);
    },
    refreshBind() {
      let iterator = 0;

      while (iterator > this.bindObj.length) {
        this.bindObj[iterator].unbind(this.bindObj[iterator + 1]);
        iterator = iterator + 2;
      }
    },
    updateData(data) {
      let self = this;
      setTimeout(function() {
        self.data = data;
        self.bindAllData();
      }, 500);
      //EventBus.$emit("test", data);
    },
    onCollapsed(value) {
      this.collapseMenu = value;
    },
    selecFloor(id) {
      let self = this;
      this.data.floors.forEach(function(el) {
        if (el.id === id) {
          self.floorSelected = el.name;
        }
      });
      //console.log(id, "== id, data", this.data);
      //this.floorSelected = id;
    },
    onTicketsHide() {
      this.hideTickets = !this.hideTickets;
      if (this.hideTickets && this.viewerHide) {
        this.hideTickets = false;
      }
      setTimeout(() => {
        this.$refs.appViewer.resize();
      }, 500);
    },
    onViewerHide() {
      this.viewerHide = !this.viewerHide;
      if (this.hideTickets && this.viewerHide) {
        this.viewerHide = false;
      }
      if (!this.viewerHide) {
        setTimeout(() => {
          this.$refs.appViewer.resize();
        }, 500);
      }
    }
  }
});
</script>

<style scoped>
.app-viewer-display.dataViewHide {
  width: 100%;
  height: 100% !important;
}
.dataViewDisplay.dataViewHide {
  display: none;
}
.app-viewer-display.viewerHide {
  display: none;
}
.dataViewDisplay.viewerHide {
  width: 100%;
  height: 100% !important;
}

.roomcontext {
  position: absolute;
  /*min-height: calc(100%);*/
  margin-left: 11%;
  width: calc(16%);
}
.container-fluid {
  width: 100vw;
  height: 100vh;
  font-family: sans-serif;
}

.main-content {
  width: 100vw;
  height: calc(100vh - 64px);
  overflow: hidden;
  position: relative;
  display: flex;
}

.sidebarContext-display {
  height: 100%;
  width: 191px;
}
.app-viewer-display {
  height: 100%;
  width: 50%;
}

.dataViewDisplay {
  background-color: rgba(1, 2, 1, 0);
  width: 50%;
  height: 100%;
  position: relative;
}
@media screen and (max-width: 992px) {
  .app-viewer-display {
    height: 50%;
    width: 100%;
  }

  .dataViewDisplay {
    width: 100%;
    height: 50%;
  }
}

.view-container {
  width: calc(100% - 191px);
  position: relative;
  display: flex;
  flex-wrap: wrap;
}

.view-container,
.view-container > * {
  transition: 500ms all cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
