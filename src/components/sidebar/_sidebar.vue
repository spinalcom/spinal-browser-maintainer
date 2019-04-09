<template>
  <div>
    <div id="sidebar"
         class="sidebar"
         v-bind:class="{ 'sidebar-transparent': pageOptions.pageSidebarTransparent }">

      <div class="overflow-scroll height-full"
           v-scroll="handleScroll">
        <ul class="nav">
          <sidebar-item ref="sidebarNavList"
                        v-for="(menu,index) of menus"
                        :key="index"
                        :menu="menu"
                        :scrollTop="scrollTop"
                        @collapse-other="handleCollapseOther(menu)"
                        :status="menu.status"></sidebar-item>

          <li><a href="javascript:;"
               class="sidebar-minify-btn"
               @click="handleSidebarMinify()"><i class="fa fa-angle-double-left"></i></a></li>

        </ul>
      </div>

      <div class="sidebar-bg"></div>
      <div class="mobile-click"
           @click="dismissSidebar"></div>

    </div>
  </div>
</template>

<script>
import PageOptions from "../../config/PageOptions";
import { sidebarService } from "./getData";
import sidebarItem from "./sidebarItem.vue";

export default {
  name: "Sidebar",
  components: {
    "sidebar-item": sidebarItem
  },
  created() {
    sidebarService.getFloor().then(res => {
      let content = {
        title: "Floors",
        icon: "fa fa-building",
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

      this.menus.push(content);
    });
  },
  data() {
    return {
      scrollTop: "",
      pageOptions: PageOptions,
      menus: []
    };
  },
  directives: {
    scroll: {
      inserted: function(el, binding) {
        let f = function(evt) {
          if (binding.value(evt, el)) {
            el.removeEventListener("scroll", f);
          }
        };
        el.addEventListener("scroll", f);
        if (typeof Storage !== "undefined") {
          if (localStorage.sidebarScroll) {
            el.scrollTop = localStorage.sidebarScroll;
          }
        }
      }
    }
  },
  methods: {
    handleScroll: function(evt) {
      this.scrollTop = evt.target.scrollTop;
      if (typeof Storage !== "undefined") {
        localStorage.setItem("sidebarScroll", this.scrollTop);
      }
    },
    dismissSidebar: function() {
      this.pageOptions.pageMobileSidebarToggled = false;
      this.pageOptions.pageMobileRightSidebarToggled = false;
    },
    handleCollapseOther: function(menu) {
      for (var i = 0; i < this.menus.length; i++) {
        this.$refs.sidebarNavList[i].collapse(menu);
      }
    },
    handleSidebarMinify: function() {
      this.pageOptions.pageSidebarMinified = !this.pageOptions
        .pageSidebarMinified;
    }
  }
};
</script>
