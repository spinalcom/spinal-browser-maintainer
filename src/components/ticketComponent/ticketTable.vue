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
          <p v-on="on"
             id="title">{{title}}</p>
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
          <span>Export to CSV.</span>
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
          <span>Calendar</span>
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
          <span>Show Tickets Color</span>
        </v-tooltip>
        <filter-dialog :steps="steps"
                       :selectedSteps="selectedSteps"></filter-dialog>
      </div>

    </div>
    <v-data-table :headers="headers"
                  :items="allTickets"
                  :pagination.sync="pagination"
                  :rows-per-page-items="pagination.rowsPerPageItems"
                  :total-items="pagination.totalItems"
                  class="elevation-1 ticketTableDisplay">
      <template v-slot:no-data>
        <v-alert :value="true"
                 color="error"
                 icon="warning">
          Sorry, nothing to display
        </v-alert>
      </template>

      <template slot="headerCell"
                slot-scope="props">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">
              {{ props.header.text }}
            </span>
          </template>
          <span>
            {{ props.header.text }}
          </span>
        </v-tooltip>
      </template>
      <template v-slot:items="props">
        <!-- <td>{{test(props)}}</td> -->
        <td @mouseover="overTableRow(props)"
            @mouseleave="mouseLeave()"
            @click="onClick(props, $event)">{{ props.item.info.name.get() }}</td>
        <td @mouseover="overTableRow(props)"
            @mouseleave="mouseLeave()"
            @click="onClick(props, $event)"
            class="text-xs-right">
          {{ ticketDate(props.item.info.creationDate.get()) }}</td>
        <td class="text-xs-right"
            @click="onClick(props, $event)"
            @mouseover="overTableRow(props)"
            @mouseleave="mouseLeave()">
          {{ props.item.info.stepName }}<p class="colorPatchDisplay displayInline"
             :style="{backgroundColor: props.item.info.color.get()}"></p>
        </td>
        <td style="float:right; padding-top:10px">
          <v-icon @click="selectDetails(props)">not_listed_location</v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { EventBus } from "../../config/event";
import filterDialog from "./filterDialog.vue";
import graph from "../../config/GraphService";

export default {
  name: "ticketTable",
  components: {
    filterDialog
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
        { text: "Creation Date", value: "creation date", align: "center" },
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
      oldTarget: {}
    };
  },
  props: ["allTickets", "steps", "selectedSteps", "title"],
  mounted() {
    console.log(
      "MONTED allTickets",
      this.allTickets,
      this.steps,
      this.selectedSteps,
      this.title
    );
  },
  methods: {
    test(props) {
      console.log(props);
    },
    onResize() {},
    backToProcess() {
      EventBus.$emit("getBackToProcess", true);
    },
    predicat: function(node) {
      return node.info.type.get() === "BIMObject";
    },
    analytics() {
      EventBus.$emit("show-analytics");
    },
    overTableRow(el) {
      let self = this;
      graph.SpinalGraphService.findNodes(
        el.item.id,
        [
          "SpinalSystemServiceTicketHasLocation",
          "hasBIMObject",
          "hasReferenceObject"
        ],
        self.predicat
      ).then(lst => {
        EventBus.$emit("select-tickets-room", lst);
      });
    },
    hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
        : null;
    },
    getContrastYIQ(hexcolor) {
      const rgb = this.hexToRgb(hexcolor);
      var yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      return yiq >= 128 ? "black" : "white";
    },
    getstyle(step) {
      return {
        "background-color": step.color.get(),
        color: this.getContrastYIQ(step.color.get())
      };
    },
    mouseLeave() {
      EventBus.$emit("mouse-leave");
    },
    selectDetails(item) {
      console.log(item.item);

      EventBus.$emit("ticket-details", spinal.spinalGraphService.getInfo(item.item.info.id.get()));
    },
    onClick(item, event) {
      if (this.clicked === false) {
        event.target.parentElement.style.backgroundColor = "#2D3D93";
        event.target.parentElement.style.color = "white";
        this.oldTarget = event.target;
        this.clicked = true;
      } else {
        this.oldTarget.parentElement.style.color = "black";
        this.oldTarget.parentElement.style.backgroundColor = "white";
        this.clicked = false;
      }

      EventBus.$emit("display-colors", [item.item]);
    },
    showTicketsColor() {
      EventBus.$emit("display-colors", this.allTickets);
    },
    exportCsv() {
      EventBus.$emit("export");
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
    },
    ticketDate(value) {
      return this.timeConverter(value);
    }
  }
};
</script>
<style>
.ticketTableDisplay,
.v-table__overflow {
  height: calc(100% - 48px);
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

.displayInline {
  display: inline;
  padding-left: 20px;
}
.colorPatchDisplay {
  border-style: none;
  padding-top: 2px;
}
.ticketTableDisplay {
  height: calc(100% - 55px);
  position: relative;
}

#selectEyeForTickets {
  float: right;
  margin-top: 7px;
  padding: 3px;
}
#title {
  margin-left: calc(10vh);
  display: inline;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
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
