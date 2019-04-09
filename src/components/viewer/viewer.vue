<template>
  <div class="col-md-10 col-lg-10 viewerContainer"
       id="autodesk_forge_viewer">

  </div>

</template>


<script>
// import Vue from "vue";
import ForgeViewer from "./forgeViewer";

let forgeViewer = new ForgeViewer();

export default {
  name: "appViewer",
  // props: ["collapseMenu"],
  data() {
    return {};
  },
  mounted() {
    forgeViewer.start_viewer(document.getElementById("autodesk_forge_viewer"));
  }
};
</script>

<style scoped>
/* .mainLayout {
  width: calc(100% - 50px);
  position: relative;
  -webkit-transition-duration: 0.3s;

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
} */

@media screen and (max-width: 900px) {
  #autodesk_forge_viewer {
    width: 100%;
    height: calc(60%);
    padding: 0px;
    margin-top: 10px;
    display: block;
  }
}
</style>
