
<template>
  <div class="sidebarContext">

      <div v-for="element in icons" >
        <v-icon v-on:click="onClick" class="icon-display" :data="element.data">{{element.icon}}</v-icon>
      </div>

  </div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
  data() {
    return {
      icons: [
      { icon: "home",
        data: "data1" },
      { icon : "info",
        data: "data2" },
      { icon : "event",
        data: "data3" }
      ]
    };
  },
  props: ["floors"],
  mounted() { },
  methods: {
    onClick: function(event) {
      EventBus.$emit("selectContext", event.target.getAttribute('data'));
    }
  }
};
</script>

<style>
.sidebarContext {
  background: grey;
  width: 70px;
  height: 51%;
  display: flex;
  overflow: auto;
  padding-left: 15px;
  margin-top: calc(49vh);
}
.icon-display {
  margin-top: 2vh;
}
</style>
