// const {
//   spinalPanelManagerService,
//   SpinalMountExtention
// } = require("spinal-env-viewer-panel-manager-service");

const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");
import {
  TICKET_PANEL_NAME,
  TICKET_PANEL_TITLE
} from './config';
import Vue from "vue";
import TicketPanel from "./vue/TicketPanel.vue";
import "./contextMenu/contextMenu";
// import aVueCompomentDialog from "./testCompomentDialog.vue";
// const {
//   spinalContextMenuService,
//   SpinalContextApp
// } = require("spinal-env-viewer-context-menu-service");

// create a node
const extentionCreated = SpinalForgeExtention.createExtention({
  name: TICKET_PANEL_NAME,
  vueMountComponent: Vue.extend(TicketPanel),
  // toolbar is optional
  toolbar: {
    icon: "event",
    label: "Ticket",
    subToolbarName: "spinalcom"
  },
  panel: {
    title: TICKET_PANEL_TITLE,
    classname: "ticket-panel-manager",
    closeBehaviour: "delete" // if something else panel is deleted
    // closeBehaviour: "hide" // if something else panel is deleted
  },
  style: {
    left: "405px",
    height: "259px",
    width: "16px"
  },
  onLoad: function () { },
  onUnLoad: function () { }
});

SpinalForgeExtention.registerExtention(TICKET_PANEL_NAME, extentionCreated);

// SpinalMountExtention.mount({
//   name: "myCustomDialogName",
//   vueMountComponent: Vue.extend(aVueCompomentDialog),
//   parentContainer: document.body
// });

// create an test class that extends of SpinalContextApp
// class SideBarApp1 extends SpinalContextApp {
//   constructor() {
//     super("SideBarApp1", "SideBarApp1 test description", {
//       icon: "add",
//       icon_type: "in",
//       backgroundColor: "#0000FF",
//       fontColor: "#FFFFFF"
//     });
//   }

//   isShown() {
//     // if (option.testsFail === true) return Promise.resolve(-1);
//     return Promise.resolve(true);
//   }

//   action(option) {
//     option.paramSent = "hello from SideBarApp1";
//     spinalPanelManagerService.openPanel("my_test_Extention", option);

//     console.log("action clicked");
//   }
// }

// spinalContextMenuService.registerApp("GraphManagerSideBar", new SideBarApp1());

// class SideBarApp2 extends SpinalContextApp {
//   constructor() {
//     super("SideBarApp2", "SideBarApp2 test description", {
//       icon: "update",
//       icon_type: "in",
//       backgroundColor: "#FF00FF",
//       fontColor: "#00FFFF"
//     });
//   }

//   isShown(option) {
//     console.log(option);
//     if (
//       option &&
//       option.selectedNode &&
//       option.selectedNode.getName().equals("Floor0")
//     )
//       {return Promise.resolve(-1);}
//     return Promise.resolve(true);
//   }

//   action(option) {
//     option.paramSent = "hello from SideBarApp2";
//     spinalPanelManagerService.openPanel("my_test_Extention", option);
//     console.log("action clicked");
//   }
// }

// spinalContextMenuService.registerApp("GraphManagerSideBar", new SideBarApp2());

// class GolbalTopBar extends SpinalContextApp {
//   constructor() {
//     super("GolbalTopBar", "GolbalTopBar test description", {
//       icon: "update",
//       icon_type: "in",
//       backgroundColor: "#FF00FF",
//       fontColor: "#00FFFF"
//     });
//   }

//   isShown(option) {
//     console.log(option);
//     return Promise.resolve(true);
//   }

//   action(option) {
//     option.paramSent = "hello from GolbalTopBar";
//     spinalPanelManagerService.openPanel("my_test_Extention", option);
//     console.log("action clicked");
//   }
// }

// spinalContextMenuService.registerApp(
//   "GraphManagerGlobalBar",
//   new GolbalTopBar()
// );
