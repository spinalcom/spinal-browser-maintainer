<template>
  <!-- <tr>
    <td class="text-xs-right"
        @click="onSelect">{{ticketName}}
    </td>
    <td class="text-xs-right"
        @click="onSelect">{{floor}} / {{local}}
    </td>
    <td class="text-xs-right"
        @click="onSelect">{{creationDate}}
    </td>
    <td class="text-xs-right"
        @click="onSelect">{{appelant}}
    </td>

    <td class="text-xs-right state-col"
        @click="onSelect">{{stepName}} <p
         class="colorPatchDisplay displayInline"
         :style="{backgroundColor: stepColor}"></p>
    </td>
    <td class="justify-end layout">
      <v-icon class="mr-2"
              @click="$emit('onSelectDetails')">
        not_listed_location
      </v-icon>
  </tr> -->
  <tr @click="onSelect"
      @mouseenter="onMouseEnter"
      :class="{'row-selected' : isSelected}">
    <td class="text-xs-right">{{ticketName}}
    </td>
    <td class="text-xs-right">{{floor}} / {{local}}
    </td>
    <td class="text-xs-right">{{creationDate}}
    </td>
    <td class="text-xs-right">{{appelant}}
    </td>

    <td class="text-xs-right state-col">{{stepName}} <p
         class="colorPatchDisplay displayInline"
         :style="{backgroundColor: stepColor}"></p>
    </td>
    <td class="justify-end layout">
      <v-icon class="mr-2"
              :dark="isSelected"
              @click="$emit('onSelectDetails')">
        not_listed_location
      </v-icon>
  </tr>
</template>

<script>
import dataService from "../../config/data";

export default {
  name: "tableRowSpinal",
  data() {
    return {
      ticketName: "",
      creationDate: "",
      stepName: "",
      stepColor: "",
      local: "",
      floor: "",
      appelant: "",
      material: ""
    };
  },
  props: ["ticketId", "isSelected"],
  watch: {
    ticketId() {
      return this.getTicket();
    }
  },
  methods: {
    onSelect() {
      this.$emit("onSelect", {
        ticketId: this.ticketId,
        floorId: this.localModel.floor.id,
        localId: this.localModel.local.id,
        color: this.stepColor,
        materialId: this.material
      });
    },
    onMouseEnter() {
      this.$emit("onMouseEnter", {
        ticketId: this.ticketId,
        floorId: this.localModel.floor.id,
        localId: this.localModel.local.id,
        color: this.stepColor,
        materialId: this.material
      });
    },
    getTicket() {
      const ticket = spinal.spinalGraphService.getRealNode(this.ticketId);
      this.ticketName = ticket.info.name.get();
      this.creationDate = this.timeConverter(ticket.info.creationDate.get());
      try {
        this.appelant = ticket.info.appelant.get();
      } catch (e) {
        this.appelant = "-";
      }
      try {
        this.material = ticket.info.equipement.get();
      } catch (e) {
        this.material = "-";
      }
      return Promise.all([this.getLocal(ticket), this.getStep(ticket)]);
    },
    async getLocal(ticket) {
      this.localModel = await dataService.ticketGetLocal(ticket);
      this.local = this.localModel.local.name;
      this.floor = this.localModel.floor.name;
    },

    async getStep(ticket) {
      const ptr = await dataService.getTicketStep(ticket);
      this.stepName = ptr.info.name.get();
      this.stepColor = ptr.info.color.get();
    },

    timeConverter(UNIX_timestamp) {
      var a = new Date(UNIX_timestamp);
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time =
        date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
      return time;
    }
  },
  mounted() {
    return this.getTicket();
  }
};
</script>

<style scoped>
.state-col {
  position: relative;
}
.colorPatchDisplay {
  position: absolute;
  border: none;
  right: 0;
  height: 100%;
  top: 0;
  width: 10px;
}
.row-selected {
  background-color: #2d3d93;
  color: white;
}
.row-selected:hover {
  background-color: #6375d8 !important;
  color: white !important;
}
</style>
