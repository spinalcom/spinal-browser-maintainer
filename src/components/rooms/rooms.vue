<template>
  <div class="roomsSidebar col-md-2 col-lg-2 d-inline-block">

  </div>
</template>

<script>
import PageOptions from "../../config/PageOptions";

export default {
  name: "Rooms",
  data() {
    PageOptions.pageContentFullWidth = true;
    PageOptions.pageContentFullHeight = true;

    return {};
  }
  // beforeRouteLeave(to, from, next) {
  //   PageOptions.pageContentFullWidth = false;
  //   PageOptions.pageContentFullHeight = false;
  //   next();
  // }
};
</script>

<style scoped>
.roomsSidebar {
  height: calc(100%);
  border: 1px solid red;
}

@media screen and (max-width: 900px) {
  .roomsSidebar {
    width: 100%;
    height: calc(40%);
    display: block;
    border: 1px solid blue;
  }
}
</style>
