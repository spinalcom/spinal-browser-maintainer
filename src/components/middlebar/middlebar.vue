<template>
  <div class="middleBar">
  </div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
  name: "MiddleBar",
  data() {
    return {
      data: []
    }
  },
  mounted() {
    this.getEvents();
  },
  methods: {
    getEvents() {
      EventBus.$on("choose-room", () => {
        // this.Dosomething();
      });

      EventBus.$on("choose-device", () => {
        // this.Dosomething();
      });

      EventBus.$on("choose-ticket", () => {
        // this.Dosomething();
      });

    }
  }
};
</script>

<style scoped>
.middleBar {
  width: 100%;
  border: solid;
  border-width: 1px;
  margin-right: 1%;
  margin-left: 4px;
  height: 6%;
  overflow: auto;
}

</style>
