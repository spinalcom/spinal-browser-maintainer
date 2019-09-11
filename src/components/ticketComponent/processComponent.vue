<template>
  <div class="overflowDisplayProcess">
    <div class="selectEyeForTickets">
      <button>
        <v-icon>get_app</v-icon>
      </button>
      <button>
        <v-icon>assessment</v-icon>
      </button>
    </div>
    <p class="displayProcessElementTitle">Choose a process</p>
    <div class="displayProcessElementMainContent">
      <div v-for="element in proDisplayLst"
           class="displayButtonChooseProcess">
        <button class="buttonProcessDisplay"
                @click="selectProcess(element.processName)">
          <!-- 				<v-badge right color="red">
      <template v-slot:badge>
        <span class="processBadge">6</span>
      </template> -->
          {{ element.processName }}
          <p class="displayCountBadge"
             v-if="element.tickets.length !== 0">{{ element.tickets.length }}
          </p>
        </button>

      </div>

    </div>
  </div>
</template>

<script>
import { EventBus } from "../../config/event";
let lastSelected = null;

export default {
  name: "processComponent",
  data() {
    return {
      BadgeValue: {},
      actualizeBadge: true,
      proDisplayLst: []
    };
  },
  props: ["processList", "allData", "backFrom", "load"],
  methods: {
    selectProcess(target) {
      EventBus.$emit("select-process", target);
      // if (target.target.className !== "displayCountBadge") {
      //   let txt = target.target.innerHTML
      //     .split(/</g)[0]
      //     .split("\n")
      //     .join("");
      //   txt = txt.split("\t").join("");
      //   EventBus.$emit("select-process", txt);
      // }
    },
    calculateTotal(bool, item) {
      console.log("START calculateTotal");
      console.log("this.allData", this.allData, item);
      if (bool) lastSelected = item;
      // console.log("ITEM", item, this);
      // console.log("this.BadgeValue HELLLO", this.BadgeValue, this.processList);
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
                console.log(ticket);

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

      // if (this.backFrom !== "") {
      //   let rooms = this.allData.rooms;
      //   for (var room in rooms) {
      //     if (rooms[room].floor === this.backFrom) {
      //       this.BadgeValue = rooms[room].processNumber;
      //     }
      //   }
      //   return;
      // }

      // if (bool) {
      //   if (typeof item.tickets !== "undefined") {
      //     for (const ticket of item.tickets) {
      //       const processName = ticket.processName;
      //       if (typeof this.BadgeValue[processName] === "undefined") {
      //         this.BadgeValue[processName] = 1;
      //       } else {
      //         this.BadgeValue[processName] += 1;
      //       }
      //     }

      //   }

      //   // let rooms = this.allData.rooms;
      //   // for (var mRoom in rooms) {
      //   //   if (rooms[mRoom].floor === item.name) {
      //   //     this.BadgeValue = rooms[mRoom].processNumber;
      //   //   }
      //   // }
      // } else {
      //   console.log("calculateTotal ", this.allData);
      //   this.BadgeValue = this.allData.totalTickets.count;
      // }
    },
    displayBadge(value) {
      //   if (this.BadgeValue === undefined) {
      //     return " ";
      //   }
      //   console.log("this.BadgeValue", this.BadgeValue, value);
      //   if (this.BadgeValue[value] === undefined) return " ";
      //   else return this.BadgeValue[value];
    },
    getEvent() {
      EventBus.$on("reset-select", () => this.calculateTotal(true));
      EventBus.$on("click-room", item => this.calculateTotal(true, item));
      EventBus.$on("data-update", () => this.calculateTotal(false));
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
    // if (this.load) {
    // this.calculateTotal(false);
    // } else {
    //   setTimeout(function() {
    //     self.calculateTotal(false);
    //   }, 3000);
    // }
  }
};
</script>
<style scoped>
.selectEyeForTickets {
  float: right;
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
  height: calc(100% - 32px);
  overflow: auto;
  padding-bottom: 16px;
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
}
</style>
