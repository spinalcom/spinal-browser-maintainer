<template>
  <div>
    <sidebar-menu :collapsed="collapseMenu"
                  :menu="menu"
                  @itemClick="onItemClick"
                  @collapse="onCollapse" />
  </div>
</template>

<script>
import Vue from "vue";
// import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import spinalGraphService from "../../config/GraphService";
import { sidebarService } from "./getData";

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
    // VueSidebarMenu
  },
  created() {
    sidebarService.getFloor().then(res => {
      let content = {
        title: "Floors",
        icon: "fa fa-building",
        badge: {
          text: res.length
        },
        child: []
      };

      if (res.length === 0) {
        content.child.push({
          title: "No Floors found !",
          disabled: true
        });
      } else {
        res.forEach(el => {
          content.child.push({
            id: el.id,
            title: el.name,
            action: "isolate"
          });
        });
      }

      this.menu.push(content);
    });

    // this.menu.push({
    //   title: "etage1",
    //   child: [{ title: "room1" }, { title: "room2" }]
    // });
    // console.log(this.menu);
    // console.log("-------");
    spinalGraphService.getOccupations();
  },
  methods: {
    onCollapse(collapsed) {
      this.$emit("collapsed", collapsed);
    },
    onItemClick(event, item) {
      event.preventDefault();

      switch (item.action) {
        case "isolate":
          break;

        default:
          break;
      }
    }
  }
});
</script>