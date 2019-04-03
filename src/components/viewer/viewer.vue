<template>
  <div :class="{'collapsed' : !collapseMenu}"
       class="mainLayout">
    <div class="viewerContainer"
         id="autodesk_forge_viewer"></div>

  </div>

</template>


<script>
// import Vue from "vue";
import ForgeViewer from "./forgeViewer";

let forgeViewer = new ForgeViewer();

export default {
  name: "appViewer",
  props: ["collapseMenu"],
  data() {
    return {};
  },
  mounted() {
    console.log(this.collapseMenu);

    forgeViewer.start_viewer(document.getElementById("autodesk_forge_viewer"));
  }
};
</script>

<style scoped>
.mainLayout {
  width: calc(100% - 50px);
  position: relative;
  -webkit-transition-duration: 0.3s;
  /* text-align: center;
   */
  margin-left: 50px;
}

.mainLayout.collapsed {
  width: calc(100% - 350px);
  margin-left: 350px;
}

.viewerContainer {
  width: calc(100% - 20px);
  height: 500px;
  position: relative;
  margin: 10px;
}
</style>
