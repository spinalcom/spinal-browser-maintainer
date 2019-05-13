<template>
  <div class="dataview" v-if="dashboard === 'default'">
      <preview-data :allData="allData"
                    :floorSelected="floorSelected">
      </preview-data>
  </div>
  <div class="dataview" v-else-if="dashboard === 'ticket'">
      <ticket-data :allData="allData"
                   :floorSelected="floorSelected">
      </ticket-data>
  </div>
  <div class="dataview" v-else-if="dashboard === 'equipment'">
      <equipment-data :allData="allData"
                      :floorSelected="floorSelected">
      </equipment-data>
  </div>
</template>
<script>
import previewData from "../dataviewcomponent/preview";
import ticketData from "../dataviewcomponent/ticket";
import equipmentData from "../dataviewcomponent/equipment";
import { EventBus } from "../../config/event";

export default {
  name: "DataView",
  components: {
    previewData,
    ticketData,
    equipmentData
  },
  props: ["allData"],
  data() {
    return {
      data: [],
      dashboard: "default",
      floorSelected: ''
    }
  },
   mounted() {
    this.getEvents();
  },
  methods: {
    getEvents() {
      EventBus.$on("choose-room", () => {
        this.dashboard = 'default';
      });

      EventBus.$on("choose-device", () => {
        this.dashboard = 'equipment';
      });

     EventBus.$on("choose-ticket", () => {
        this.dashboard = 'ticket';
      });

      EventBus.$on("click-event", (it) => {
        let self = this;

        if (this.floorSelected === it.title) {
          self.floorSelected = '';
          return;
        }

        for (var iterator in self.allData.floors)
          if (self.allData.floors[iterator].id === it.id)
              self.floorSelected = self.allData.floors[iterator].name;
      });

    }
  }
};
</script>


<style scoped>
.dataview {
  width: 100%;
  margin-left: 4px;
  height: 47%;
  overflow: auto;
  background: white;
}

</style>
