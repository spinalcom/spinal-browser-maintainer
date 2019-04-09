
<template>
  <li v-if="hasChildren()"
      class="has-sub active">

    <a href="#"
       @click.prevent.stop="expand()">

      <b class="caret"></b>
      <i v-if="menu.icon"
         :class="menu.icon"></i>

      <span>{{ menu.title }}</span>
    </a>

    <ul class="sub-menu"
        :class="{ 'd-block': this.stat == 'expand', 'd-none': this.stat == 'collapse' }"
        :style="{ marginTop: (pageOptions.pageSidebarMinified) ? - (scrollTop + 40) + 'px' : '' }">
      <template v-for="(submenu,index) in menu.child">
        <sidebar-item :menu="submenu"
                      :key="index"
                      ref="sidebarNavList"
                      @collapse-other="handleCollapseOther(submenu)"></sidebar-item>
      </template>
    </ul>

  </li>
</template>


<script>
import PageOptions from "../../config/PageOptions";
import sidebarItem from "./sidebarItem.vue";

export default {
  name: "sidebarItem",
  props: ["menu"],
  components: {
    sidebarItem
  },
  data() {
    return {
      stat: "",
      pageOptions: PageOptions
    };
  },
  methods: {
    hasChildren() {
      return this.menu.child && this.menu.child.length > 0;
    },
    handleCollapseOther: function(menu) {
      for (var i = 0; i < this.menu.children.length; i++) {
        this.$refs.sidebarNavList[i].collapse(menu);
      }
    },
    expand: function() {
      this.stat = this.stat == "expand" ? "collapse" : "expand";

      this.$emit("collapse-other", this.menu);
    },
    collapse: function(menu) {
      if (this.menu != menu) {
        this.stat = "collapse";
      }
    },
    collapseOther: function() {
      this.$emit("collapse-other", this.menu);
    }
  }
};
</script>