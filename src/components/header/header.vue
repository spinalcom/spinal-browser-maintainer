<template>
  <nav class="navbar navbar-light bg-light mainNavbar">
    <!-- <a class="navbar-brand" -->
       <!-- href="#"> -->
      <img src="../../assets/SEML LOGO split.jpg"
           id="spinalcomLogo"
           class="d-inline-block align-top"
           alt="spinalcom">
      <img src="../../assets/Eiffage Logo.jpg"
           id="spinalcomLogo"
           class="d-inline-block align-top"
           alt="spinalcom">
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

