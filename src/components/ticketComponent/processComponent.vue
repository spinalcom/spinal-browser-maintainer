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
  <div class="overflowDisplayProcess">
    <div class="displayProcessElementMainContent">
      <!-- <md-table md-card
                style="min-height: 400px;">
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title">
              {{ translate('Choose a process') }}
            </h1>
          </div>

          <md-field class="md-toolbar-section-end toolbar-openMission">
            <v-btn v-bind="{type:'rounded', small: true}"
                   class="media-v-btn--icon"
                   href="https://www.alteva.net/EMIssiON?base=semlrdl"
                   target="_blank">
              <v-icon>open_in_new</v-icon>
              <span class="btn-open-emission-text">Ouvrir eMission</span>
            </v-btn>
          </md-field>
        </md-table-toolbar>

        <md-table-row v-for="element in proDisplayLst"
                      @click="selectProcess(element.processName)">
          <md-table-cell>
            {{ element.processName }}
          </md-table-cell>

          <md-table-cell v-for="statusName in statusNames"
                         :key="statusName.name"
                         class="table-header-cell-process">
            <div v-tooltip="statusName.name"
                 class="cell-color-status"
                 :style="{
                   'background-color': statusName.color
                 }"></div>
            {{ getNbTicketByStatus(element.tickets,statusName.name) }}
          </md-table-cell>
        </md-table-row>
      </md-table> -->

      <v-card>
        <v-card-title>
          <v-toolbar flat
                     color="white">
            <v-toolbar-title>
              {{ translate('Choose a process') }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-bind="{type:'rounded', small: true}"
                   class="media-v-btn--icon"
                   href="https://www.alteva.net/EMIssiON?base=semlrdl"
                   target="_blank">
              <v-icon>open_in_new</v-icon>
              <span class="btn-open-emission-text">Ouvrir eMission</span>
            </v-btn>
          </v-toolbar>
          <div style="width: 100%;">
            <v-data-table hide-headers
                          hide-actions
                          :items="proDisplayLst"
                          class="elevation-1">
              <template v-slot:items="props">
                <tr @click="selectProcess(props.item.processName)">
                  <td>{{ props.item.processName }}</td>
                  <td v-for="statusName in statusNames"
                      :key="statusName.name"
                      v-tooltip="statusName.name"
                      class="table-header-cell-process">
                    <div class="cell-color-status"
                         :style="{
                           'background-color': statusName.color
                         }"></div>
                    {{ getNbTicketByStatus(props.item.tickets, statusName.name) }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </v-card-title>
      </v-card>
      <v-card>
        <v-card-title>
          <v-toolbar flat
                     color="white">
            <v-toolbar-title>
              Legends
            </v-toolbar-title>
          </v-toolbar>

          <!-- <div style="width: 100%;text-align: center;">
            <h3 class="headline mb-2">
              Legends
            </h3>
          </div> -->

          <div
            style="display: flex; flex-wrap: wrap;justify-content: space-around;">
            <div v-for="statusName in statusNames"
                 :key="statusName.name"
                 style="padding: 8px;">
              <v-card style="width:150px; display:flex; align-items: center;">
                <v-card-title
                  style="padding: 8px 12px;  margin-bottom: 0!important">
                  <h4 class="mb-0">
                    {{ statusName.name }}
                  </h4>
                  <div v-tooltip="statusName.name"
                       class="cell-color-status"
                       :style="{
                         'background-color': statusName.color
                       }"></div>
                </v-card-title>
              </v-card>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../../config/event";
let lastSelected = null;
import { tl } from "../../config/i18n";

export default {
  name: "ProcessComponent",
  props: ["processList", "allData", "backFrom", "load"],
  data() {
    return {
      BadgeValue: {},
      actualizeBadge: true,
      proDisplayLst: [],
      statusNames: []
    };
  },
  computed: {
    headers() {
      return ["", ...this.statusNames];
    }
  },
  watch: {
    backFrom() {
      this.calculateTotal(false, this.backFrom);
    },
    processList() {
      this.calculateTotal();
    }
  },
  mounted() {
    // let self = this;
    this.getEvent();
    this.calculateTotal(false);
    this.statusNames = this.allData.allStatusNames;
  },
  methods: {
    translate: tl,
    getNbTicketByStatus(tickets, statusName) {
      let count = 0;
      for (const ticket of tickets) {
        if (ticket.step.info.name.get() === statusName) count++;
      }
      return count;
    },
    selectProcess(target) {
      EventBus.$emit("select-process", target);
    },
    calculateTotal(bool, item) {
      if (bool) lastSelected = item;
      this.proDisplayLst = this.processList.map(e => {
        return { processName: e, tickets: [] };
      });
      if (!this.allData.ticketsByProcess) {
        return;
      }
      for (var i = 0; i < this.allData.ticketsByProcess.length; i++) {
        const ticketsInProcess = this.allData.ticketsByProcess[i];
        for (const ticketInStep of ticketsInProcess) {
          for (const ticket of ticketInStep) {
            for (const process of this.proDisplayLst) {
              if (ticket.processName === process.processName) {
                // if (typeof process.tickets !== 'undefined') process.tickets = [];

                if (
                  !lastSelected ||
                  (lastSelected.type === "geographicFloor" &&
                    ticket.floorName === lastSelected.name) ||
                  (lastSelected.type === "geographicRoom" &&
                    ticket.roomName === lastSelected.name)
                ) {
                  process.tickets.push(ticket);
                }
                break;
              }
            }
          }
        }
      }
    },
    getEvent() {
      EventBus.$on("show-bat", () => this.calculateTotal(true));
      EventBus.$on("click-room", item =>
        this.calculateTotal(true, item.select)
      );
      EventBus.$on("data-update", () => this.calculateTotal(false));
    }
  }
};
</script>

<style>
/* .displayProcessElementMainContent * {
    color: black !important;
    background-color: white !important;
} */
</style>

<style scoped>
.table-header-cell-process {
  position: relative;
}
.cell-color-status {
  height: 100%;
  width: 8px;
  top: 0;
  left: 0;
  position: absolute;
}
.toolbar-openMission::after {
  height: 0 !important;
}
.selectEyeForTickets {
  position: absolute;
  right: 10px;
  top: 10px;
}
.displayCountBadge {
  display: inline-grid;
  background-color: red;

  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  margin-bottom: 0px;
  padding-top: 2px;
}
.displayProcessElementTitle {
  margin-top: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.overflowDisplayProcess {
  overflow: auto;
  height: 100%;
}
.processBadge {
  margin-left: 0px;
}
.displayProcessElementMainContent {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 16px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 20px;
}

.displayProcessElementMainContent::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.displayProcessElementMainContent::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: rgba(169, 169, 169, 0.9);
}
.displayProcessElementMainContent::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

.displayButtonChooseProcess {
  display: flex;
  align-items: center;
  justify-content: center;
}
.buttonProcessDisplay {
  background-color: grey;
  color: white;
  margin-left: 0%;
  width: 52%;
  padding: 2%;
  margin-top: 2%;
  cursor: pointer;
}
@media screen and (max-width: 983px) {
  .overflowDisplayProcess {
    overflow: initial !important;
  }

  .media-v-btn--icon.v-btn--small {
    width: 28px;
  }
  .media-v-btn--icon {
    padding: 0;
  }
  .media-v-btn--icon {
    background: transparent;
    box-shadow: none !important;
    border-radius: 50%;
    justify-content: center;
    min-width: 0;
    width: 36px;
  }
  .media-v-btn--icon .btn-open-emission-text {
    display: none;
  }
}
</style>
