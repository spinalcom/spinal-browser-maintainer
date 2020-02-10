<template>
  <div class="ticketTableMainContainer">
    <div class="ticketTableHeaderContainer">
      <!-- <button class="backButton"
              @click="backToProcess">
        <v-icon color="white">arrow_back</v-icon>
      </button> -->
      <v-btn text
             icon
             @click="backToProcess">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <h3 v-on="on"
              id="title">{{title}}</h3>
        </template>
        <span>{{title}}</span>
      </v-tooltip>

      <div class="ticketTableHeaderBtnRow">
        <!-- <v-btn text
               icon
               @click="exportCsv">
          <v-icon>get_app</v-icon>
        </v-btn>
        <v-btn text
               icon
               @click="analytics">
          <v-icon>assessment</v-icon>
        </v-btn> -->

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on"
                   text
                   icon
                   @click="exportCsv">
              <v-icon>get_app</v-icon>
            </v-btn>
          </template>
          <span>{{translate('Export to CSV.')}}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on"
                   text
                   icon
                   @click="analytics">
              <v-icon>assessment</v-icon>
            </v-btn>
          </template>
          <span>Calendrier</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on"
                   text
                   icon
                   @click="showTicketsColor">
              <v-icon>remove_red_eye</v-icon>
            </v-btn>
          </template>
          <span>{{translate('Show Tickets Color')}}</span>
        </v-tooltip>
        <filter-dialog ref="filterDialog"
                       :steps="steps"
                       :selectedSteps="selectedSteps"></filter-dialog>
      </div>

    </div>

    <v-data-table :headers="headers"
                  :items="ticketComputed"
                  :pagination.sync="pagination"
                  :rows-per-page-items="pagination.rowsPerPageItems"
                  :total-items="pagination.totalItems"
                  class="elevation-1 ticketTableDisplay">
      <template v-slot:no-data>
        <v-alert :value="true"
                 icon="warning"
                 color="error"
                 style="width:100%;text-align: center;display:block;">
          <h2>
            {{translate('Sorry, nothing to display')}}
          </h2>
          <p>
            {{translate('Try to modify option\'s filter')}}
          </p>
          <v-btn primary
                 text
                 @click="openFilterDialog">
            <v-icon>filter_list</v-icon>{{translate('Filter Option')}}
          </v-btn>

        </v-alert>
      </template>

      <template slot="headerCell"
                slot-scope="props">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">
              {{ translate(props.header.text) }}
            </span>
          </template>
          <span>
            {{ translate(props.header.text) }}
          </span>
        </v-tooltip>
      </template>
      <template v-slot:items="props">
        <tableRowSpinal @onSelect="onClick"
                        @onMouseEnter="onMouseEnter"
                        @onSelectDetails="selectDetails(props)"
                        :isSelected="selectedItemId === props.item.info.id.get()"
                        :ticketId="props.item.info.id.get()"></tableRowSpinal>
        <!-- <tr> -->

        <!-- <td>{{test(props)}}</td> -->
        <!-- <td @mouseover="overTableRow(props)"
            @mouseleave="mouseLeave()"
            @click="onClick(props, $event)">{{ props.item.info.name.get() }}
        </td>
        <td @mouseover="overTableRow(props)"
            @mouseleave="mouseLeave()"
            @click="onClick(props, $event)"
            class="text-xs-right">
          {{ ticketDate(props.item.info.creationDate.get()) }}</td>
        <td class="text-xs-right"
            @click="onClick(props, $event)"
            @mouseover="overTableRow(props)"
            @mouseleave="mouseLeave()">
          <stepName :ticketId="props.item.info.id.get()"></stepName>
          <p class="colorPatchDisplay displayInline"
             :style="{backgroundColor: props.item.info.color.get()}"></p>
        </td>
        <td style="float:right; padding-top:10px">
          <v-icon @click="selectDetails(props)">not_listed_location</v-icon>
        </td>
        </tr> -->
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { EventBus } from "../../config/event";
import filterDialog from "./filterDialog.vue";
import graph from "../../config/GraphService";
import { tl } from "../../config/i18n";
import stepName from "./stepName.vue";
import dataService from "../../config/data";
import tableRowSpinal from "./tableRowSpinal";

const getTicketStep = dataService.getTicketStep;

export default {
  name: "ticketTable",
  components: {
    filterDialog,
    stepName,
    tableRowSpinal
  },
  data() {
    return {
      headers: [
        {
          text: "Ticket Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Room", value: "Room", align: "center" },
        { text: "Creation Date", value: "creation date", align: "center" },
        { text: "Caller", value: "Caller", align: "center" },
        { text: "Step", value: "step", align: "center" },
        { text: "Details", align: "right" }
      ],
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: 16,
        sortBy: "creationDate",
        totalItems: 0,
        rowsPerPageItems: [17]
      },
      clicked: false,
      selectedItemId: "",
      ticketComputed: []
    };
  },
  props: ["allTickets", "steps", "selectedSteps", "title"],
  mounted() {
    return this.updateAllTickets();
  },
  computed: {
    // ticketComputed() {
    //   const ticketComputed = [];
    //   for (const ticket of this.allTickets) {
    //     const step = graph.SpinalGraphService.getInfo(ticket.info.stepId.get());
    //     if (!step) continue;
    //     console.log("selectedSteps", step.name.get(), ticket, step);
    //     if (this.selectedSteps.some(e => e.name === step.name.get()))
    //       ticketComputed.push(ticket);
    //   }
    //   return ticketComputed;
    // }
  },
  watch: {
    allTickets() {
      return this.updateAllTickets();
    }
  },
  methods: {
    getTicketStep(tickets) {
      const prom = [];
      for (const ticket of tickets) {
        prom.push(
          getTicketStep(ticket).then(step => {
            return { step, ticket };
          })
        );
      }
      return Promise.all(prom);
    },
    async updateAllTickets() {
      this.ticketComputed = [];
      const ticketSteps = await this.getTicketStep(this.allTickets);
      for (const { step, ticket } of ticketSteps) {
        if (this.selectedSteps.some(e => e.name === step.info.name.get()))
          this.ticketComputed.push(ticket);
      }
      // this.ticketComputed = this.allTickets;
      // console.log("allTickets", this.allTickets);
    },
    // async getStepName(ticket) {
    //   // const step = await dataService.getTicketStep(ticket);
    //   const ptr = await dataService.getTicketStep(ticket);
    //   return ptr.info.name.get();

    //   // console.log("steps", this.selectedSteps);
    // },
    translate(str) {
      return tl(str);
    },
    backToProcess() {
      EventBus.$emit("getBackToProcess", true);
    },
    // predicat: function(node) {
    //   return node.info.type.get() === "BIMObject";
    // },
    analytics() {
      EventBus.$emit("show-analytics", this.ticketComputed);
    },
    openFilterDialog() {
      this.$refs.filterDialog.open();
    },
    // overTableRow(el) {
    //   let self = this;
    //   graph.SpinalGraphService.findNodes(
    //     el.item.id,
    //     [
    //       "SpinalSystemServiceTicketHasLocation",
    //       "hasBIMObject",
    //       "hasReferenceObject"
    //     ],
    //     self.predicat
    //   ).then(lst => {
    //     EventBus.$emit("select-tickets-room", lst);
    //   });
    // },
    // hexToRgb(hex) {
    //   var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    //   hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    //     return r + r + g + g + b + b;
    //   });

    //   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    //   return result
    //     ? {
    //         r: parseInt(result[1], 16),
    //         g: parseInt(result[2], 16),
    //         b: parseInt(result[3], 16)
    //       }
    //     : null;
    // },
    // getContrastYIQ(hexcolor) {
    //   const rgb = this.hexToRgb(hexcolor);
    //   var yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    //   return yiq >= 128 ? "black" : "white";
    // },
    // getstyle(step) {
    //   return {
    //     "background-color": step.color.get(),
    //     color: this.getContrastYIQ(step.color.get())
    //   };
    // },
    // mouseLeave() {
    //   EventBus.$emit("mouse-leave");
    // },
    selectDetails(item) {
      console.log(item.item);

      EventBus.$emit(
        "ticket-details",
        spinal.spinalGraphService.getInfo(item.item.info.id.get())
      );
    },
    onMouseEnter(item) {
      if (!this.selectedItemId) {
        item.fit = false;
        EventBus.$emit("display-ticket", item);
      }
    },
    onClick(item) {
      if (this.selectedItemId != item.ticketId) {
        this.selectedItemId = item.ticketId;
        item.fit = true;
        EventBus.$emit("display-ticket", item);
      } else {
        this.selectedItemId = "";
        item.fit = false;
        EventBus.$emit("display-ticket", item);
      }

      // if (this.clicked === false) {
      //   event.target.parentElement.style.backgroundColor = "#2D3D93";
      //   event.target.parentElement.style.color = "white";
      //   this. = event.target;
      //   this.clicked = true;
      // } else {
      //   this..parentElement.style.color = "black";
      //   this..parentElement.style.backgroundColor = "white";
      //   this.clicked = false;
      // }
    },
    showTicketsColor() {
      EventBus.$emit("display-colors", this.ticketComputed);
    },
    exportCsv() {
      EventBus.$emit("export", this.ticketComputed);
    }
    // timeConverter(UNIX_timestamp) {
    //   var a = new Date(UNIX_timestamp);
    //   var months = [
    //     "Jan",
    //     "Feb",
    //     "Mar",
    //     "Apr",
    //     "May",
    //     "Jun",
    //     "Jul",
    //     "Aug",
    //     "Sep",
    //     "Oct",
    //     "Nov",
    //     "Dec"
    //   ];
    //   var year = a.getFullYear();
    //   var month = months[a.getMonth()];
    //   var date = a.getDate();
    //   var hour = a.getHours();
    //   var min = a.getMinutes();
    //   var sec = a.getSeconds();
    //   var time =
    //     date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    //   return time;
    // },
    // ticketDate(value) {
    //   return this.timeConverter(value);
    // }
  }
};
</script>
<style>
.ticketTableDisplay > .v-table__overflow {
  height: calc(100% - 48px);
  overflow-y: auto;
}
.ticketTableDisplay > .v-table__overflow::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.ticketTableDisplay > .v-table__overflow::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: rgba(169, 169, 169, 0.9);
}
.ticketTableDisplay > .v-table__overflow::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
</style>


<style scoped>
.ticketTableMainContainer {
  height: 100%;
  width: 100%;
}
.ticketTableMainContainer > .ticketTableHeaderContainer {
  width: 100%;
  height: 42px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ticketTableHeaderContainer > .ticketTableHeaderBtnRow {
  overflow: hidden;
  display: flex;
}

.ticketTableHeaderContainer > .ticketTableHeaderBtnRow .v-btn {
  margin-left: 0;
  margin-right: 0;
}

.newdisplay {
  background-color: black;
  color: white;
}
.elevation-1 {
  margin-left: 10px;
  margin-right: 10px;
}

.ticketTableDisplay {
  height: calc(100% - 55px);
  overflow-y: hidden;
  position: relative;
}

#selectEyeForTickets {
  float: right;
  margin-top: 7px;
  padding: 3px;
}
#title {
  margin-left: calc(10vh);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  margin-top: 12px;
}
.customColor {
  color: var(--accent-color);
}
.v-alert {
  color: black;
}
.backButton {
  box-sizing: border-box !important;
  background-color: black;
  color: white;
  padding: 9px;
  margin-top: 5px;
  margin-left: 8px;
  font-size: 17px;
  font-family: sans-serif;
  padding-top: 4px;
  width: 90px;
  padding-bottom: 8px;
}
.v-badge__badge {
  margin-top: 11px;
}

.layout {
  float: right !important;
  font-family: sans-serif !important;
}

@media screen and (max-width: 1402px) {
  #title {
    margin-left: 0 !important;
    font-size: 14px;
  }
}

@media screen and (max-width: 993px) {
  #title {
    margin-left: 20px !important;
  }
}

@media screen and (max-width: 750px) {
  #title {
    margin-left: calc(2vh) !important;
  }
}
</style>
