import Vue from "vue";

import App from "./app.vue";
import VueSidebarMenu from 'vue-sidebar-menu'

Vue.use(VueSidebarMenu);

new Vue(App).$mount("#app");
