const {
  spinalContextMenuService
} = require("spinal-env-viewer-context-menu-service");

import AddTicketContext from "./buttons/AddTicketContext";

spinalContextMenuService.registerApp("myHookName", new AddTicketContext());

spinalContextMenuService
  .getApps("myHookName", {
    testsFail: false
  })
  .then(console.log.bind(null, "test1 :"));
