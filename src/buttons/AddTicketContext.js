//import { SpinalContextApp } from 'spinal-env-viewer-context-menu-service';
const {
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");


export default class SpinalContextAppTest extends SpinalContextApp {
  constructor() {
    super("testlabel", "test description", {
      icon: "add",
      icon_type: "in",
      backgroundColor: "#000000",
      fontColor: "#FFFFFF"
    });
  }

  isShown( option ) {
      return Promise.resolve( true );
  }

  action( option ) {
    console.log('action clicked');
  }
}