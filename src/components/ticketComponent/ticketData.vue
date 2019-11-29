<template class="renderDataTicket">

  <transition name="ticket-change-page-anim">

    <div v-if="active == 'default'">
      <process-component :processList="allData.process"
                         :allData="allData"
                         :backFrom="backFrom"
                         :load="load">
      </process-component>
    </div>
    <div v-else-if="active == 'table'">
      <ticket-table :allTickets="selectedTicket"
                    :steps="steps"
                    :selectedSteps="selectedSteps"
                    :title="selectProcess">
      </ticket-table>
    </div>
    <div v-else-if="active == 'detail'">
      <ticket-details :ticket="ticketDetails">

      </ticket-details>
    </div>
    <div v-else-if="active == 'calendar'">
      <ticket-calendar :selectedTicket="selectedTicket"
                       :steps="steps">

      </ticket-calendar>
    </div>
  </transition>

</template>

<script>
import { EventBus } from "../../config/event";
import graph from "../../config/GraphService";
import processComponent from "./processComponent.vue";
import ticketTable from "./ticketTable.vue";
import ticketDetails from "./ticketDetails";
import ticketCalendar from "./ticketCalendar.vue";
import getTicket from "./getTicketInfo";

export default {
  name: "ticketData",
  data() {
    return {
      active: "default",
      levelSelected: "",
      process: [],
      steps: [],
      ticketDetails: {},
      allTickets: [],
      selectedTicket: [],
      selectedSteps: [],
      init: true,
      selectProcess: "",
      eventRoom: false,
      overTickets: [],
      backFrom: "",
      load: false,
      roomSelected: ""
    };
  },
  components: {
    "process-component": processComponent,
    "ticket-table": ticketTable,
    "ticket-details": ticketDetails,
    "ticket-calendar": ticketCalendar
  },
  props: ["allData"],
  mounted() {
    this.getEvents();
    this.getTicket();
  },
  methods: {
    getTicket() {
      return graph.SpinalGraphService.waitForInitialization()
        .then(() => {
          return this.getAllTickets();
        })
        .then(() => {
          return this.extractProcess();
        });
    },

    getEvents() {
      let self = this;
      // EventBus.$on("click-event", item => (self.levelSelected = item.name));
      EventBus.$on("select-process", process => {
        console.log("process", process);

        self.active = "table";
        self.selectProcess = process;
        self.triTicket();
        self.load = true;
      });
      EventBus.$on("getBackToProcess", lvl => {
        self.active = "default";
        if (lvl === true) self.backFrom = self.levelSelected;
      });
      EventBus.$on("getBackToTable", () => {
        self.active = "table";
      });
      EventBus.$on("select-steps", selected => {
        self.selectedSteps = selected;
        self.init = false;
        self.triTicket();
      });
      EventBus.$on("calendar-tickets", arrayOfNode => {
        this.selectedTicket = arrayOfNode;
        this.active = "table";
      });
      EventBus.$on("click-room", item => self.addOverOnTableElement(item));
      EventBus.$on("show-bat", () => self.addOverOnTableElement());
      EventBus.$on("ticket-details", item => self.showDetails(item));
      EventBus.$on("export", () => self.exportCsv());
      EventBus.$on("show-analytics", () => (self.active = "calendar"));
      EventBus.$on("close-details", () => (self.active = "table"));
      EventBus.$on("reset-select", () => {
        self.backFrom = "";
        self.resetOverOnTableElement();
        self.levelSelected = "";
        self.triTicket();
      });
    },
    exportCsv() {
      let result = [];
      result.push([
        "floor",
        "room",
        "process",
        "name",
        "step",
        "creation date",
        "author",
        "note"
      ]);
      const prom = [];
      for (var node of this.selectedTicket) {
        prom.push(getTicket(node.info.id.get()));
      }
      Promise.all(prom).then(res => {
        res.forEach(ticket => {
          result.push([
            ticket.floor,
            ticket.local,
            ticket.processName,
            ticket.ticketName,
            ticket.stepName,
            ticket.creationDate,
            ticket.appelant,
            encodeURI(
              spinal.spinalGraphService
                .getRealNode(ticket.ticketId)
                .info.note.get()
            )
          ]);
        });
        this.download("ticket_export.csv", result);
      });

      // for (var node in this.selectedTicket) {
      //   result.push([
      //     this.selectedTicket[node].floorName,
      //     this.selectedTicket[node].roomName,
      //     this.selectedTicket[node].processName,
      //     this.selectedTicket[node].name.get(),
      //     this.selectedTicket[node].stepName,
      //     this.timeConverter(this.selectedTicket[node].creationDate.get()),
      //     this.selectedTicket[node].username.get(),
      //     this.selectedTicket[node].note.get()
      //   ]);
      // }

      // this.download("ticket_export.csv", result);
    },
    showDetails(item) {
      this.ticketDetails = item;
      this.active = "detail";
    },
    extractProcess() {
      this.steps = [];
      for (var ticket in this.selectedTicket) {
        if (
          this.steps.indexOf(this.selectedTicket[ticket]["stepName"]) == -1 &&
          this.selectedTicket[ticket]["stepName"] !== undefined
        ) {
          this.steps.push(this.selectedTicket[ticket]["stepName"]);
        }
      }
    },
    addOverOnTableElement(items) {
      if (!items) {
        this.levelSelected = "";
      } else if (items.select.type === "geographicFloor") {
        this.levelSelected = items.select.name;
      }
      // this.roomSelected = items.select;
      this.triTicket();
      // if (items === "reset") {
      //   if (this.overTickets.length !== 0) {
      //     for (var el in this.overTickets) {
      //       this.overTickets[el].over = "false";
      //     }
      //   }
      //   return;
      // }
      // if (items.tickets !== undefined) {
      //   if (this.selectProcess === "") {
      //     this.eventRoom = true;
      //   } else {
      //     this.overTickets = items.tickets;
      //     for (var el in items.tickets) {
      //       items.tickets[el].over = true;
      //     }
      //   }
      // }
    },
    resetOverOnTableElement() {
      this.eventRoom = false;
    },
    getProcessByName(processName) {
      for (var i = 0; i < this.allData.process.length; i++) {
        if (this.allData.process[i] === processName) {
          // console.log(this.allData.ticketsByProcess[i]);
          return this.allData.ticketsByProcess[i];
        }
      }
    },
    flatten(array) {
      var flattend = [];
      (function flat(array) {
        array.forEach(function(el) {
          if (Array.isArray(el)) flat(el);
          else flattend.push(el);
        });
      })(array);
      return flattend;
    },

    triTicket() {
      this.selectedTicket = [];
      if (!this.selectProcess) {
        return;
      }
      const proc = this.getProcessByName(this.selectProcess);
      if (!proc) return console.log("triTicket process undefined");
      this.selectedTicket = this.flatten(proc).reduce((acc, e) => {
        if (!this.levelSelected) {
          acc.push(e.ticket);
        } else if (this.levelSelected === e.floorName) {
          acc.push(e.ticket);
        }
        return acc;
      }, []);
      // this.extractProcess();
    },
    addStep(node, processName) {
      let self = this;
      graph.SpinalGraphService.getChildren(node.process.info.id.get()).then(
        processNode => {
          let array = [];
          for (var i in processNode) {
            if (
              processNode[i].type.get() === "SpinalSystemServiceTicketTypeStep"
            ) {
              if (self.process.indexOf(processName === -1)) {
                self.process[processName] = [];
              }
              if (
                self.process[processName].indexOf(
                  processNode[i].name.get() === -1
                )
              ) {
                array.push(processNode[i].name.get());
                self.process[processName].push(array);
              }
              if (node.step.info.id.get() == processNode[i].id.get()) {
                node["stepName"] = processNode[i].name.get();
              }
            }
          }
        }
      );
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
    getAllTickets() {
      let self = this;
      let tmp;
      return new Promise(resolve => {
        for (var floorLvl in self.allData.rooms) {
          for (var allRooms in self.allData.rooms[floorLvl].rooms) {
            if (
              self.allData.rooms[floorLvl].rooms[allRooms].tickets != undefined
            ) {
              if (
                self.allTickets[self.allData.rooms[floorLvl].floor] == undefined
              ) {
                self.allTickets[self.allData.rooms[floorLvl].floor] = [];
                self.allData.rooms[floorLvl].rooms[allRooms].tickets.forEach(
                  el => {
                    tmp = graph.SpinalGraphService.getRealNode(
                      el.process.info.id.get()
                    );
                    el["idObject"] =
                      self.allData.rooms[floorLvl].rooms[allRooms].id;
                    el["processName"] = tmp.info.name.get();
                    el["floorName"] = self.allData.rooms[floorLvl].floor;
                    el["roomName"] =
                      self.allData.rooms[floorLvl].rooms[allRooms].name;
                    self.addStep(el, tmp.info.name.get());
                    self.allTickets[self.allData.rooms[floorLvl].floor].push(
                      el.ticket
                    );
                  }
                );
              } else {
                self.allData.rooms[floorLvl].rooms[allRooms].tickets.forEach(
                  el => {
                    tmp = graph.SpinalGraphService.getRealNode(
                      el.process.info.id.get()
                    );
                    if (tmp !== undefined) {
                      el["processName"] = tmp.info.name.get();
                      el["idObject"] =
                        self.allData.rooms[floorLvl].rooms[allRooms].id;
                      el["floorName"] = self.allData.rooms[floorLvl].floor;
                      el["roomName"] =
                        self.allData.rooms[floorLvl].rooms[allRooms].name;
                      self.addStep(el, tmp.info.name.get());
                      self.allTickets[self.allData.rooms[floorLvl].floor].push(
                        el.ticket
                      );
                    }
                  }
                );
              }
            }
            if (
              floorLvl == self.allData.rooms.length - 1 &&
              allRooms == self.allData.rooms[floorLvl].rooms.length - 1
            ) {
              resolve(true);
            }
          }
        }
      });
    },
    download(filename, arr) {
      let element = document.createElement("a");
      let doc = "";
      for (var key in arr) {
        doc += `${arr[key]}\n`;
      }
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(doc)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  },
  watch: {
    levelSelected() {
      this.triTicket();
      this.extractProcess();
    },
    allData() {
      this.allTickets = [];
      this.process = [];
      this.getAllTickets().then(() => {
        this.triTicket();
        this.extractProcess();
      });
    }
  }
};
</script>

<style>
.renderDataTicket {
  background-color: rgba(1, 2, 1, 0);
  height: 100%;
  width: 100%;
}
</style>

<style scoped>
.ticket-change-page-anim-enter-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.ticket-change-page-anim-enter {
  opacity: 0;
  transform: translateX(-1em);
  min-width: unset;
}

.ticket-change-page-anim-enter-to {
  opacity: 1;
  transform: translateX(0);
  min-width: unset;
}
</style>
