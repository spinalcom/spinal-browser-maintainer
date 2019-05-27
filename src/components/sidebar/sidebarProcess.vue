
<template>
  <div class="sidebarProcess">

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
  mounted() {
    this.getEvents();
  },
  methods: {
   update: function(el) {
      console.log("update process", el);
    },
    getEvents: function() {
      EventBus.$on("selectCategory", type => this.update(type));
    },
    onClick: function(event) {
     // console.log("click on ", event.target.getAttribute('data'));
      EventBus.$emit("selectProcess", event.target.getAttribute('data'));
    }
  }
};
</script>

<style>
.sidebarProcess {
  background: red;
  width: 70px;
  height: 51%;
  display: flex;
  overflow: auto;
  padding-left: 15px;
  margin-top: calc(49vh);
  margin-left: calc(8.2vw);
  z-index: 400;
}
.icon-display {
  margin-top: 2vh;
}
</style>
