<template>
  <div class="roomsSidebar">

    <div class="room_equipment_select">
      <vs-select width="100%"
                 class="selectRoom"
                 label="Rooms/Equipments"
                 v-model="typeSelected">

        <vs-select-item :key="index"
                        :value="item.value"
                        :text="item.title"
                        v-for="(item,index) in selectOptions" />
      </vs-select>

    </div>

    <div class="list-item"
         v-for="(item,index) of  data"
         :key="index"
         @mouseover="mouseOver(item)"
         @mouseleave="mouseLeave()"
         @click="isolate(item)"
         :class="{'selected' : isSelected(item.id)}">

      {{item.name}}
    </div>

    <div class="noItems"
         v-if="floorSelected && data.length === 0">
      No Items found !
    </div>

    <div class="noItems"
         v-if="!floorSelected">
      Please select a floor !
    </div>

  </div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
  name: "Rooms",
  props: ["floorSelected", "rooms", "equipments"],
  data() {
    this.selectOptions = [
      {
        value: "rooms",
        title: "Rooms"
      },
      { value: "equipments", title: "Equipments" }
    ];
    return {
      typeSelected: "rooms",
      roomsSelected: null,
      data: []
    };
  },
  methods: {
    mouseOver(item) {
      EventBus.$emit("mouse-over", item);
    },
    isolate(item) {
      this.roomsSelected = item.id;
      EventBus.$emit("click-event", item);
    },
    update() {
      this.data = [];
      switch (this.typeSelected) {
        case "rooms":
          var dataFiltered = this.rooms.filter(el => {
            return el.floor === this.floorSelected;
          });

          for (let index = 0; index < dataFiltered.length; index++) {
            const element = dataFiltered[index];
            this.data = this.data.concat(element.rooms);
          }

          break;

        default:
          break;
      }
    },
    mouseLeave() {
      EventBus.$emit("mouse-leave");
    },
    isSelected(id) {
      return this.roomsSelected === id;
    }
  },
  watch: {
    typeSelected: function() {
      this.update();
    },
    floorSelected: function() {
      this.update();
    }
  }
};
</script>

<style scoped>
.roomsSidebar {
  width: 20%;
  height: calc(100%);
  padding: 10px;
  border-right: 1px solid gray;
}

.list-item {
  width: 100%;
  border-bottom: 1px solid gray;
  text-align: center;
  padding: 10px;
  text-transform: capitalize;
}

.noItems {
  width: 100%;
  text-align: center;
  padding: 10px;
  text-transform: capitalize;
  color: red;
}

.list-item:hover {
  cursor: pointer;
  color: green;
}

.list-item.selected {
  border-right: 4px solid green;
}

.room_equipment_select {
  border-bottom: 1px solid gray;
  padding-bottom: 10px;
}

@media screen and (max-width: 900px) {
  .roomsSidebar {
    width: 100%;
    height: calc(40%);
    display: block;
  }
}
</style>
