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
  <div v-if="rendering"
       class="mySidebar-container">
    <div v-if="selectedLevel"
         class="mySidebarx">
      <div class="sidebar-goto-floor-btn-container">
        <p id="floorSelectedTitleId">
          {{ translate('Building') }}
        </p>
        <v-icon dark
                class="icon-show-floor"
                @click="showBat">
          remove_red_eye
        </v-icon>
      </div>
      <!-- <p id="HeaderTitle">{{translate('Building')}}</p> -->
      <div v-for="(item) in floors"
           :key="item.name"
           :title="item.name">
        <v-divider style="width: 190px"
                   color="white"></v-divider>
        <div class="sitebarElementItem"
             @click="onItemClick(item)"
             @mouseover="mouseOver(item)"
             @mouseleave="mouseLeave()">
          <div class="sitebarElement">
            <span>
              {{ item.name }}
            </span>
          </div>
          <div v-if="getTiketsNumber(item)!==0"
               class="displayBadge">
            <p style="color:white !important">
              {{ getTiketsNumber(item) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else
         class="mySidebarx">
      <div class="sidebar-goto-floor-btn-container">
        <div id="floorSelectedTitleId"
             class="sidebar-goto-floor-btn"
             @click="backToFloor">
          <i class="material-icons"> keyboard_arrow_left
          </i><span>{{ floor }}</span>
        </div>
        <v-icon dark
                class="icon-show-floor"
                @click="showFloor">
          remove_red_eye
        </v-icon>
      </div>
      <div v-for="item in roomsDisplayed"
           :key="item.name">
        <v-divider style="width: 190px"
                   color="white"></v-divider>
        <div class="sitebarElementItem"
             :class="{'selected-item': item.id === itemSelectedId}"
             @click="onItemClick(item)"
             @mouseover="mouseOver(item)"
             @mouseleave="mouseLeave()">
          <div class="sitebarElement"
               :value="item"
               :title="item.name">
            <span>
              {{ item.name }}
            </span>
          </div>

          <div v-if="numberForBadge(item.tickets)!==0"
               class="displayBadge">
            <!-- <div class="displayBadge" -->
            <!-- > -->
            <p style="color:white !important">
              {{ numberForBadge(item.tickets) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="mySidebarx-logo-container">
      <img id="spinalcomLogo"
           src="../../assets/spinalcomv2-power by.png"
           alt="spinalcom">
    </div>
  </div>
</template>

<script>
import { EventBus } from "../../config/event";
import { tl } from "../../config/i18n";

export default {
  props: ["floors", "rooms", "allData"],
  data() {
    return {
      active: true,
      notExpand: false,
      reduce: true,
      menus: [],
      selectedLevel: true,
      itemSelectedId: "",
      selectedLevelId: "",
      roomsDisplayed: [],
      roomSelected: "",
      oldTarget: {},
      selectedProcess: "",
      rendering: true,
      counter: {}
    };
  },
  mounted() {
    let content = {
      title: "Floors",
      icon: "fa fa-building",
      child: []
    };

    if (this.floors.length === 0) {
      content.child.push({
        title: "No Floors found !",
        disabled: true
      });
    } else {
      this.floors.forEach(el => {
        content.child.push({
          id: el.id,
          title: el.name,
          type: "floor",
          icon: "location_city"
        });
      });
    }

    EventBus.$on("select-process", processName => {
      this.selectedProcess = processName;
      this.calculeTotalTicket(this.floors);
      // setTimeout(function() {
      //   self.rendering = false;
      //   self.rendering = true;
      // }, 1000);
    });

    EventBus.$on("getBackToProcess", () => {
      this.selectedProcess = "";
      this.calculeTotalTicket(this.floors);
      // setTimeout(function() {
      //   self.rendering = false;
      //   self.rendering = true;
      // }, 1000);
    });

    this.menus.push(content);
  },
  created() {
    let self = this;
    // for (var item in this.floors) {
    // this.calculeTotalTicket(this.floors[item]);
    // }

    // setTimeout(function() {
    self.calculeTotalTicket(self.floors);
    // }, 3000);
    // setTimeout(function() {
    //   self.rendering = false;
    //   self.rendering = true;
    // }, 3002);
  },
  methods: {
    translate: tl,
    getTiketsNumber(ticket) {
      for (const floor of this.allData.rooms) {
        if (floor.floor === ticket.name) {
          return floor.count;
        }
      }
      return 0;
    },
    calculeTotalTicket() {
      for (let i = 0; i < this.rooms.length; i++) {
        this.counter[i] = this.rooms[i].count;
      }
    },
    onItemClick(item) {
      // if (target !== undefined) {
      //   if (this.roomSelected !== item.id) {
      //     if (this.oldTarget.target !== undefined) {
      //       this.oldTarget.target.parentElement.style.backgroundColor =
      //         "#272727";
      //     }
      //     this.roomSelected = item.id;
      //     target.target.parentElement.style.backgroundColor = "#2D3D93";
      //     this.oldTarget = target;
      //   } else {
      //     this.roomSelected = "";
      //     target.target.parentElement.style.backgroundColor = "#272727";
      //     this.oldTarget = {};
      //     EventBus.$emit("click-room", "reset");
      //     return;
      //   }
      // }
      // switch (item.type) {
      //   case "geographicFloor":
      //     // EventBus.$emit("click-event", item);
      //     // EventBus.$emit("click-room", item, this.selectedLevelId);
      //     this.openFloor(item.name);
      //     break;

      //   default:
      //     break;
      // }
      if (item.type === "geographicFloor") {
        this.selectedLevelId = item.id;
        this.selectedLevelItem = item;
        this.itemSelectedId = "";
        this.openFloor(item.name);
        EventBus.$emit("click-room", {
          select: item,
          floor: this.selectedLevelId
        });
      } else if (item.type === "geographicRoom") {
        if (this.itemSelectedId === item.id) {
          this.itemSelectedId = "";
          EventBus.$emit("click-room", {
            select: this.selectedLevelItem,
            floor: this.selectedLevelId,
            noSelect: true
          });
        } else {
          this.itemSelectedId = item.id;
          EventBus.$emit("click-room", {
            select: item,
            floor: this.selectedLevelId
          });
        }
      }
      // EventBus.$emit("click-event", item);
      return;
    },
    shortenText(text) {
      return text.replace(/(.{18})..+/, "$1…");
    },
    numberForBadge(tickets) {
      let count = 0;
      if (tickets !== undefined) {
        if (this.selectedProcess !== "") {
          for (const el in tickets) {
            if (
              !this.allData.statusEnd.includes(
                tickets[el].step.info.name.get()
              ) &&
              tickets[el].processName == this.selectedProcess
            ) {
              count++;
            }
          }
          return count;
        } else {
          for (const el in tickets) {
            if (
              !this.allData.statusEnd.includes(tickets[el].step.info.name.get())
            ) {
              count++;
            }
          }
          return count;
        }
      } else {
        return 0;
      }
    },
    backToFloor() {
      this.selectedLevel = true;
      this.itemSelectedId = "";
      EventBus.$emit("show-bat");
    },
    openFloor(floorSelected) {
      if (this.selectedLevel) this.selectedLevel = false;
      else this.selectedLevel = true;
      for (var i in this.rooms) {
        if (this.rooms[i].floor == floorSelected) {
          this.roomsDisplayed = this.rooms[i].rooms;
        }
      }
      this.floor = floorSelected;
    },
    mouseOver(item) {
      if (!this.itemSelectedId) {
        EventBus.$emit("mouse-over", item);
      }
    },
    // isolate(item) {
    //   this.roomsSelected = item.id;
    //   EventBus.$emit("click-room", item, this.selectedLevelId);
    // },
    mouseLeave() {
      if (!this.itemSelectedId) {
        EventBus.$emit("mouse-leave");
      }
    },
    showFloor() {
      this.itemSelectedId = "";
      EventBus.$emit("show-floor", this.selectedLevelId);
    },
    showBat() {
      this.itemSelectedId = "";
      EventBus.$emit("show-bat");
    }
  }
};
</script>

<style scoped>
#HeaderTitle {
  color: white;
  background-color: grey;
  margin-left: -6px;
  height: 32px;
  padding-top: 9px;
  padding-left: 9px;
  margin-top: -6px;
  margin-left: 0px;
  margin-bottom: 0px !important;
}

.span.v-badge__badge.red {
  margin-top: 1px !important;
}

p {
  margin-bottom: 10px !important;
}

#floorSelectedTitleId {
  background-color: grey;
  border-radius: 0px 0px 10% 10%;
  color: white;
  height: 24px;
  padding-left: 2px;
  padding-top: 2px;
  margin-bottom: 0px !important;
  display: flex;
}
#floorSelectedTitleId > * {
  align-self: center;
}
.mySidebar-container {
  background-color: #272727;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.mySidebarx {
  flex-grow: 1;
  width: 100%;
  overflow: auto;
}
.sidebar-goto-floor-btn {
  cursor: pointer;
}
.mySidebarx-logo-container {
  /* background-color: rgb(237, 237, 237);; */
  border-right: #222 solid;
  margin: 5px 0px;
  /* width: 100%; */
}

.mySidebarx-logo-container > img {
  padding: 8px;
}

.mySidebarx::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.mySidebarx::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: rgba(169, 169, 169, 0.9);
}
.mySidebarx::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
.badgeElementInSidebar {
  margin-top: 18px;

  background-color: white;
}
.displayBadge {
  display: inline-flex;
  height: 20px;
  width: 20px;
  /* padding-top: 3px;
  padding-left: 5px; */
  text-align: center;

  border-radius: 50%;
  background-color: red;
  float: right;
  margin-top: 8px;
  pointer-events: none;
}
.displayBadge > p {
  width: inherit;
}

.sitebarElement > span {
  overflow: hidden;
  white-space: nowrap;
}
.sitebarElement {
  width: 150px;
  color: white;
  display: inline-grid;
  margin-bottom: 10px;
  margin-top: 10px;
  padding-left: 8px;
  pointer-events: none;
}
.sitebarElementItem:hover > .sitebarElement {
  color: #356bab;
}
.sitebarElementItem {
  cursor: pointer;
}
.icon-show-floor {
  position: absolute;
  right: 0;
  top: 0;
}

.icon-show-floor:hover {
  background-color: #356bab;
  border-radius: 50%;
}

.sidebar-goto-floor-btn-container {
  position: relative;
}
#floorSelectedTitleId.sidebar-goto-floor-btn:hover {
  color: #2d3d93;
}
.selected-item {
  background-color: #2d3d93;
}
.sidebarDivider {
  width: 92%;
}
</style>
