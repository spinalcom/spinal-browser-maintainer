<template>
  <div v-if="data"
       class="container-fluid">
    <app-header></app-header>
    <div class="main-content" data-app>
      <div class="sidebarContext-display">
        <app-sidebar :floors="data.floors"
                     @selectFloor="selecFloor"
                     :rooms="data.rooms"
                     :allData="data"></app-sidebar>

      </div>

      <div class="view-container">
        <app-viewer class="app-viewer-display"></app-viewer>

        <ticket-data class="dataViewDisplay"
                     :allData="data"></ticket-data>
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
      floorSelected: null,
      test: {},
      bindObj: []
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
      self.bindAllData();
    }, 3000);
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

.view-container, .view-container > * {
  transition: 500ms all cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
