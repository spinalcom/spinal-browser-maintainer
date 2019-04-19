<template>
  <div class="selectBar">
    <md-icon class="md-size-1x" value="room" v-on:click.native="onClick">room</md-icon>

    <md-icon class="md-size-1x" value="devices" v-on:click.native="onClick">devices</md-icon>

<!--     <vs-select v-model="typeSelected">

        <vs-select-item :key="index"
                        :value="item.value"
                        :text="item.title"
                        v-for="(item,index) in selectOptions" />
      </vs-select>   -->
    </div>
  </template>

<script>

export default {
  name: "SelectBar",
  data() {
    return {
      data: [],
      selectOptions: this.for,
      typeSelected: this.model
    }
  },
  methods: {
    onClick(event) {
      console.log(event.target.getAttribute("value"));
    }
  },
  props: ["model", "for"]
};
</script>

<style scoped>
.selectBar {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: white;
}

</style>
