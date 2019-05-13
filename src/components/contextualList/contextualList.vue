<template>
  <div class="contextualList">

    <rooms :floorSelected="floorSelected"
                     :rooms="rooms"
                     :equipments="equipments"></rooms>
  </div>
</template>

<script>
import Rooms from "../rooms/rooms.vue";

export default {
  name: "contextualList",
  components: {
    Rooms
  },
  props: ["floorSelected", "rooms", "equipments"],
  data() {
     return {
      data: []
    };
  },
  mounted() {},
  methods: {},
  watch: {
    rooms() {
      console.log("rooms update", this.rooms);
    }
  }
};
</script>

<style scoped>
.contextualList {
  width: 20%;
  height: calc(47%);
  padding: 10px;
  overflow: auto;
  background: #333333;
}

@media screen and (max-width: 900px) {
  .contextualList {
    width: 100%;
    height: calc(40%);
    display: block;
  }
}
</style>