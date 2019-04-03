<template>
  <div>
    <sidebar-menu :collapsed="collapseMenu"
                  :menu="menu"
                  @collapse="onCollapse" />
  </div>
</template>

<script>
import Vue from "vue";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import spinalGraphService from "../../config/GraphService";

export default Vue.extend({
  props: ["collapseMenu"],
  data() {
    return {
      menu: [
        {
          header: true,
          title: "Spinalcom Maintainer"
          //component: componentName
          //visibleOnCollapse: true
        }
      ]
    };
  },
  components: {
    VueSidebarMenu
  },
  created() {
    this.menu.push({
      title: "etage1",
      child: [{ title: "room1" }, { title: "room2" }]
    });
    console.log(this.menu);
    console.log("-------");
    spinalGraphService.getOccupations();
  },
  methods: {
    onCollapse(collapsed) {
      this.$emit("collapsed", collapsed);
    },
    onItemClick(event, item) {
      console.log("click on item", item);
    }
  }
});
</script>