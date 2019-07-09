
<template>
  <div class="mySidebarx" v-if="selectedLevel">
      <p id="HeaderTitle">Building</p>

        <div 
          v-for="item in floors"
          :key="item.name"
          @click="onItemClick(item)"
          @mouseover="mouseOver(item, $event)"
          @mouseleave="mouseLeave($event, true)"
          :title="item.name"
        >
        <v-divider color="white"></v-divider>


      <v-badge right>
      <template class="badgeElementInSidebar" v-slot:badge v-if="calculeTotalTicket(item)!==0">
        <span>{{ calculeTotalTicket(item) }}</span>
      </template>

        <p class="sitebarElement">
        {{ shortenText(item.name) }}</p>


        </v-badge>

        </div>
  </div>
  <div v-else class="mySidebarx">
    <p id="floorSelectedTitleId" @click="backToFloor">← {{ floor }}</p>
    <div 
       v-for="item in roomsDisplayed"
      :key="item.name"
      >
        <v-divider color="white"></v-divider>
      <div class="test">
<!--       <v-badge right color="red">
        <template  v-slot:badge v-if="numberForBadge(item.tickets)!==0">
          <span >{{ numberForBadge(item.tickets) }}</span>
        </template> -->
      <p class="sitebarElement"
        :value="item"
        :title="item.name"
        @mouseover="mouseOver(item, $event)"
        @mouseleave="mouseLeave"
        @click="onItemClick(item, $event)">{{ shortenText(item.name) }}
        </p>

        <div class="displayBadge" v-if="numberForBadge(item.tickets)!==0">
            <p>{{ numberForBadge(item.tickets) }}</p>
        </div>

<!--         </v-badge>
 -->        </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
  data() {
    return {
      active: true,
      notExpand: false,
      reduce: true,
      menus: [],
      selectedLevel: true,
      roomsDisplayed: [],
      roomSelected: '',
      oldTarget: {},
      selectedProcess: ""
    };
  },
  props: ["floors", "rooms", "allData"],
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

    EventBus.$on("select-process", processName => this.selectedProcess = processName);
    EventBus.$on("getBackToProcess", () => this.selectedProcess = '');

    this.menus.push(content);
  },

  methods: {
    calculeTotalTicket(item) {
      let self = this;
      setTimeout(function() {
      let count = 0;
      if (item !== undefined) {
      for (var i in self.allData.rooms) {
       // console.log(item.name, self.allData.rooms[i].floor);
        if (self.allData.rooms[i].floor === item.name) {
         // console.log("open", self.allData.rooms[i].processNumber);
          for (var el in self.allData.rooms[i].processNumber) {
           // console.log("count = ", count);
            //if (this.allData.rooms[i].rooms[el].tick)
            count = count + self.allData.rooms[i].processNumber[el];
          }
        }
      }
      if (count == 0) {
        //console.log("return", item.name , count);
        return 0;
      }
        //console.log("else", count);
        return count;
      }
      return 0;
    }, 3000)
    },
    onItemClick(item, target) {
      //console.log("cloicked", item, target);
      if (target !== undefined)
        if (this.roomSelected !== item.id) {
          if (this.oldTarget.target !== undefined) {
            this.oldTarget.target.style.backgroundColor = '#272727';
          }
          this.roomSelected = item.id;
          target.target.style.backgroundColor = '#2D3D93';
          this.oldTarget = target;
        } else {
          this.roomSelected = '';
          target.target.style.backgroundColor = '#272727';
          this.oldTarget = {};
          EventBus.$emit("click-room", 'reset');
          return;
        }
      switch (item.type) {
        case "geographicFloor":
          EventBus.$emit("click-event", item);
          this.openFloor(item.name);
          break;

        default:
          break;
      }
      this.roomsSelected = item.id;
      EventBus.$emit("click-room", item);
      return;
    },
    shortenText(text) {
      return text.replace(/(.{20})..+/, "$1…");
    },
    numberForBadge(tickets) {
      let count = 0;
      if (tickets !== undefined) {
        if (this.selectedProcess !== '') {
          for (var el in tickets)
            if (tickets[el].processName == this.selectedProcess)
              count++;
            return count;
        } else {
          return tickets.length;
        }
      } else
      return 0;
    },
    backToFloor() {
      this.selectedLevel = true;
      EventBus.$emit("reset-select");
    },
    openFloor(floorSelected) {
      console.log("select floor", this.floors, this.rooms)
      if (this.selectedLevel)
        this.selectedLevel = false;
      else
        this.selectedLevel = true;

      for (var i in this.rooms) {
        if ( this.rooms[i].floor == floorSelected )
          this.roomsDisplayed = this.rooms[i].rooms;
        }

      this.floor = floorSelected;
    },
    mouseOver(item, event) {
      if (event.target.style.color != "rgb(45, 61, 147)") {
        event.target.style.color = '#356BAB';
      }
      EventBus.$emit("mouse-over", item);
    },
    isolate(item) {
      this.roomsSelected = item.id;
      EventBus.$emit("click-room", item);
    },
    mouseLeave(event, parent) {
      if (event.target.style.color != "rgb(45, 61, 147)") {
        if (parent == true)
          event.target.children[1].children[0].style.color = "white";
        else
          event.target.style.color = "white";
      }
      EventBus.$emit("mouse-leave");
    }
  }
};
</script>

<style scoped>
#HeaderTitle {
    color: white;
    background-color: grey;
    margin-left: -6px;
    height: 34px;
    padding-top: 9px;
    padding-left: 5px;
    margin-top: -6px;
    margin-left: 0px;
    margin-bottom: 0px !important;
}
.test span {
  /*margin-top: 10px;*/
}

.span.v-badge__badge.red {
  margin-top: 1px !important;
}

p {
  margin-bottom: 10px !important;
}

#floorSelectedTitleId {
  background-color: #2D3D93;
  border-radius: 0px 0px 10% 10%;
  color: white;
  height: 22px;
  margin-bottom: 0px !important;
}
.mySidebarx {
  z-index: 100;
  background-color: #272727;
  height: 96%;
  width: 191px;
  padding-left: 8px;
  overflow: auto;

}
.badgeElementInSidebar {
  margin-top: 18px;
}
.displayBadge {
  display: inline-flex;
  height: 20px;
  width: 20px;
  padding-top: 3px;
  padding-left: 5px;
  border-radius: 50%;
  background-color: red;
}

.sitebarElement {
  width: 100px;
  color: white;
  display: inline;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-top: 7px;
  cursor: pointer;
}

.sidebarDivider {
  width: 92%;
}

.header-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  h4 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    > button {
      margin-left: 10px;
    }
  }
}

.footer-sidebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  > button {
    border: 0px solid rgba(0, 0, 0, 0) !important;
    border-left: 1px solid rgba(0, 0, 0, 0.07) !important;
    border-radius: 0px !important;
  }
}

.vs-sidebar--background {
  width: 0px !important;
  height: 0px !important;
}

.vs-sidebar.vs-sidebar-reduce {
  background: #272727;
  height: 49%;
  color: white;
}

.vs-sidebar--header {
  height: 40px;
  background: white;
  color: black;
}
</style>