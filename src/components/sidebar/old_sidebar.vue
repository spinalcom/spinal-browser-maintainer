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
import { SidebarMenu } from "../vue-sidebar-menu/index";
import "../vue-sidebar-menu/scss/vue-sidebar-menu.scss";
import { EventBus } from "../../config/event";
export default Vue.extend({
  props: ["collapseMenu", "floors"],
  data() {
    return {
      menu: [
        {
          header: true,
          title: "Spinalcom Maintainer"
        }
      ]
    };
  },
  components: {
    "sidebar-menu": SidebarMenu
  },
  mounted() {
    let content = {
      title: "Floors",
      icon: "fa fa-building",
      isCollapsed: true,
      badge: {
        text: this.floors.length
      },
      child: []
    };

    if (this.floors.length === 0) {
      content.child.push({
        title: "No Floors found !",
        disabled: true
      });
    } else {
      this.floors.forEach(el => {
        content.child.push({
          id: el.id,
          title: el.name,
          type: "floor",
          icon: "location_city"
        });
      });
    }

    this.menu.push(content);

    // spinalGraphService.getOccupations();
  },
  methods: {
    onCollapse(collapsed) {
      this.$emit("collapsed", collapsed);
    },
    onItemClick(event, item) {
      event.preventDefault();
      switch (item.type) {
        case "floor":
          this.$emit("selectFloor", item.id);
          EventBus.$emit("click-event", item);
          break;

        default:
          break;
      }
    },
    onMouseOver(event, item) {
      console.log(event, item);
    }
  }
});
</script>