<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <nav class="navbar navbar-light bg-light mainNavbar">
    <!-- <a class="navbar-brand" -->
    <!-- href="#"> -->
    <img id="spinalcomLogo"
         src="../../assets/SEML LOGO split.jpg"
         class="d-inline-block align-top"
         alt="spinalcom">
    <!-- <img src="../../assets/Eiffage Logo.jpg"
           id="spinalcomLogo"
           class="d-inline-block align-top"
           alt="spinalcom"> -->
    <!-- <img src="./SEML LOGO.jpg"
           alt="SEML LOGO">
      <hr />
      <img src="./Eiffage Logo.jpg"
           alt="Eiffage Logo">
    </div> -->

    <!-- <img src="./SEML LOGO.jpg"
           alt="SEML LOGO">
      <hr />
      <img src="./Eiffage Logo.jpg"
           alt="Eiffage Logo">
    </div> -->
    <v-btn-toggle>
      <v-btn @click="$emit('onViewerHide')">
        <v-icon>image</v-icon>
      </v-btn>
      <v-btn @click="$emit('onTicketsHide')">
        <v-icon>list</v-icon>
      </v-btn>
    </v-btn-toggle>
    <!-- </a> -->
  </nav>
</template>


<script>
export default {
  name: "Header"
};
</script>

<style scoped>
.mainNavbar {
  height: 64px;
  padding: 5px;
  border-bottom: black;
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#spinalcomLogo {
  padding: 4px;
  margin: 4px 7px;
}

.mainNavbar > img {
  height: 50px;
}
</style>

