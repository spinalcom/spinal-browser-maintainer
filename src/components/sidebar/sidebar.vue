
<template>
  <div class="mySidebarx" v-if="selectedLevel">
      <p id="HeaderTitle">Building</p>

        <div 
          v-for="item in floors"
          :key="item.name"
          @click="onItemClick(item)"
          @mouseover="mouseOver(item)"
          @mouseleave="mouseLeave()"
        >
        <p class="sitebarElement">{{ item.name }}</p>
        </div>
  </div>
  <div v-else class="mySidebarx">
    <p id="HeaderTitle" @click="backToFloor">< {{ floor }}</p>
    <div 
       v-for="item in roomsDisplayed"
      :key="item.name"
      @click="onItemClick(item)"
      >
      <p class="sitebarElement"
        :key="item.name"
        @mouseover="mouseOver(item)"
        @mouseleave="mouseLeave()"
        @click="isolate(item)">{{ item.name }}</p>
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
      roomsDisplayed: []
    };
  },
  props: ["floors", "rooms"],
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

    this.menus.push(content);
  },

  methods: {
    onItemClick(item) {
      console.log("cloicked", item);
      switch (item.type) {
        case "geographicFloor":
          this.$emit("selectFloor", item.id);
          EventBus.$emit("click-event", item);
          this.openFloor(item.name);
          break;

        default:
          break;
      }
      return;
    },
    backToFloor() {
      this.selectedLevel = true;
      EventBus.$emit("reset-select");
    },
    openFloor(floorSelected) {
      if (this.selectedLevel)
        this.selectedLevel = false;
      else
        this.selectedLevel = true;
      console.log("selecte floor ", floorSelected, this.floors);

      for (var i in this.rooms) {
        if ( this.rooms[i].floor == floorSelected )
          this.roomsDisplayed = this.rooms[i].rooms;
        }

      this.floor = floorSelected;
    },
    onMouseOver(item) {
      EventBus.$emit("mouse-over", item);
    },
    onMouseLeave() {
      EventBus.$emit("mouse-leave");
    },
    mouseOver(item) {
      EventBus.$emit("mouse-over", item);
    },
    isolate(item) {
      this.roomsSelected = item.id;
      EventBus.$emit("click-room", item);
    },
    mouseLeave() {
      EventBus.$emit("mouse-leave");
    }
  }
};
</script>

<style>
#HeaderTitle {
    color: white;
    background-color: grey;
    margin-left: -6px;
    height: 34px;
    padding-top: 9px;
    padding-left: 5px;
    margin-top: -6px;
}

.mySidebarx {
  z-index: 100;
  background-color: #272727;
  height: 96%;
  width: 160px;
  padding-left: 8px;
  padding-top: 4px;
  overflow: auto;

}

.sitebarElement {
  color: white;
  padding-top: 3px;
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