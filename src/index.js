/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import "babel-polyfill";

import Vue from "vue";


import VueBootstrap from 'bootstrap-vue'
import VueInsProgressBar from 'vue-ins-progress-bar'


// plugins css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'




// color admin css
// import './assets/css/default/style.min.css'
// import './assets/css/default/style-responsive.min.css'
// import './assets/css/default/theme/default.css'
// import './assets/css/style.css'


import App from "./app.vue";
import VueSidebarMenu from 'vue-sidebar-menu'

Vue.use(VueSidebarMenu);

Vue.use(VueBootstrap);
Vue.use(VueInsProgressBar, {
  position: 'fixed',
  show: true,
  height: '3px'
})

new Vue(App).$mount("#app");