
<template>

  <vs-sidebar :reduce="reduce"
              :reduce-not-hover-expand="notExpand"
              parent="body"
              class="sidebarx mySidebar"
              v-model="active">

    <div class="header-sidebar"
         slot="header">
      <vs-icon icon="menu"
               round></vs-icon>
    </div>

    <template class="sidebar-content"
              v-for="(menu,index) in menus">
      <vs-sidebar-group v-if="menu.child"
                        open
                        :title="menu.title"
                        :key="index">
        <vs-sidebar-item ref="sidebar-item"
                         v-for="(child,index2) in menu.child"
                         :index="index2"
                         :key="index2"
                         :icon="child.icon"
                         @click="onItemClick(child)"
                         @mouseover="onMouseOver(child)"
                         @mouseleave="onMouseLeave">

          {{child.title}}
        </vs-sidebar-item>

    </template>

  </vs-sidebar>

</template>


<script>
import { EventBus } from "../../config/event";

export default {
  data() {
    return {
      active: true,
      notExpand: false,
      reduce: true,
      menus: []
    };
  },
  props: ["floors"],
  mounted() {
    let content = {
      title: "Floors",
      icon: "fa fa-building",
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

    this.menus.push(content);

    this.disableReload();
    // spinalGraphService.getOccupations();
  },

  methods: {
    onItemClick(item) {
      switch (item.type) {
        case "floor":
          this.$emit("selectFloor", item.id);
          EventBus.$emit("click-event", item);
          break;

        default:
          break;
      }
      return;
    },
    onMouseOver(item) {
      EventBus.$emit("mouse-over", item);
    },
    onMouseLeave() {
      EventBus.$emit("mouse-leave");
    },
    disableReload() {
      setTimeout(() => {
        this.$refs["sidebar-item"].forEach(sidebars => {
          sidebars.$el.getElementsByTagName("a")[0].addEventListener(
            "click",
            function(e) {
              e.preventDefault();
            },
            false
          );

          sidebars.$el.addEventListener(
            "mouseover",
            function() {
              sidebars.$emit("mouseover");
            },
            false
          );

          sidebars.$el.addEventListener(
            "mouseleave",
            function() {
              sidebars.$emit("mouseleave");
            },
            false
          );
        });
      }, 1000);
    }
  }
};
</script>

<style lang="stylus">
.header-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  h4 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    > button {
      margin-left: 10px;
    }
  }
}

.footer-sidebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  > button {
    border: 0px solid rgba(0, 0, 0, 0) !important;
    border-left: 1px solid rgba(0, 0, 0, 0.07) !important;
    border-radius: 0px !important;
  }
}

.vs-sidebar--background {
  width: 0px !important;
  height: 0px !important;
}

.vs-sidebar.vs-sidebar-reduce {
  background: #272727;
  color: white;
}

.vs-sidebar--header {
  height: 40px;
  background: white;
  color: black;
}
</style>