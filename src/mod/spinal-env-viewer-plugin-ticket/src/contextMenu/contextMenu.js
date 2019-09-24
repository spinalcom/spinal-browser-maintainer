const TICKET_CONTEXT_MENU = "TICKET_CONTEXT_MENU";
const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import {
  spinalNodeGetParent,
  EQUIPMENT_RELATION,
  GEO_NODE_TYPE
} from '../vue/TicketDeclareView/GetSpatialContext';

class MyMenuItemExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);

    this.onBuildingContextMenuItem = this.onBuildingContextMenuItem.bind(this);
  }

  get menuId() {
    return 'DeclareTicket';
  }

  getProperties(model, dbid) {
    return new Promise((resolve, reject) => {
      return model.getProperties(dbid, (res) => {
        resolve(res);
      }, () => {
        reject();
      });
    });
  }
  isObjValid(props) {
    const datasToTest = ['ENS GMAO', 'ID MATERIEL'];
    let countOk = 0;
    for (const prop of props.properties) {
      for (const dataToTest of datasToTest) {
        if (prop.attributeName === dataToTest) {
          if (prop.displayValue === '') return false;
          countOk++;
        }
      }
      if (countOk == datasToTest.length) return true;
    }
    return false;
  }

  async getParentGeo(nodeId) {
    const node = SpinalGraphService.getRealNode(nodeId);
    let parents = await spinalNodeGetParent(node, [EQUIPMENT_RELATION]);
    return parents.filter((e) => {
      return GEO_NODE_TYPE.includes(e.info.type.get());
    })[0];
  }


  async onBuildingContextMenuItem(menu, status) {
    if (status.numSelected !== 1) return;
    console.log('onBuildingContextMenuItem', menu, status);
    const selection = this.viewer.getAggregateSelection();
    console.log(selection);
    const model = selection[0].model;
    const dbId = selection[0].selection[0];
    try {
      const spinalNode = await spinal.BimObjectService.getBIMObject(dbId, model);
      console.log('BimObjectService.getBIMObject', spinalNode);
      if (!spinalNode) return;
      const parent = await this.getParentGeo(spinalNode.info.id.get());
      console.log("parent", parent);
      const props = await this.getProperties(model, dbId);
      console.log("props", props);
      const bimObject = undefined;
      if (this.isObjValid(props)) {
        // add BIM OBJ
      }
      console.log("Valid Object OK");

      menu.push({
        title: 'Declarer un ticket sur cet Objet',
        target: () => {
          console.log("clic", parent, bimObject);
        }
      });
    } catch (e) {
      console.error(e);
    }

    // menu.push()


    // return spinal.BimObjectService.getBIMObject(dbId, model).then((res) => {
    //   console.log('BimObjectService.getBIMObject', res);
    //   if (!spinalNode) return;
    //   return this.getProperties().then(()=> {

    //   });

    //   // menu.push()
    // }).catch((e) => {
    //   console.log(e);

    // });


    // if( status.hasSelected ) {
    //   menu.push({
    //     title: 'Declarer un ticket sur cet Objet',
    //     target: () => {
    //       const selSet = this.viewer.getSelection();
    //       this.viewer.clearSelection();

    //       // Change color of selected elements to the red
    //       const color = new THREE.Vector4( 255 / 255, 0, 0, 1 );
    //       for( let i = 0; i < selSet.length; i++ ) {
    //         this.viewer.setThemingColor( selSet[i], color );
    //       }
    //     }
    //   });

    // } else {
    //   menu.push({
    //     title: 'Clear overridden corlor',
    //     target: () => {
    //       this.viewer.clearThemingColors();
    //     }
    //   });
    // }
  }

  load() {
    // Add my owned menu items
    this.viewer.registerContextMenuCallback(
      this.menuId,
      this.onBuildingContextMenuItem
    );

    return true;
  }

  unload() {
    // Remove all menu items added from this extension
    this.viewer.unregisterContextMenuCallback(this.menuId);

    return true;
  }
}

// Autodesk.Viewing.theExtensionManager.registerExtension(TICKET_CONTEXT_MENU, MyMenuItemExtension);
// SpinalForgeExtention.registerExtention(TICKET_CONTEXT_MENU, MyMenuItemExtension);


class MyContextMenu extends Autodesk.Viewing.Extensions.ViewerObjectContextMenu {
  constructor(viewer) {
    super(viewer);
  }

  // isWall(dbId) {
  //   //Logics for determining if selected element is wall or not.
  //   return new Promise((resolve, reject) => {
  //     $.get(
  //       '/api/walls/' + dbId,
  //       (response) => {
  //         if (response && response.id != 0) {
  //           return resolve(true);
  //         }
  //         return resolve(false);
  //       }
  //     )
  //       .error((error) => reject(error));
  //   });
  // }

  async buildMenu(event, status) {
    // Get defulat menu items from the super class
    const menu = super.buildMenu(event, status);

    // Do hitTest to get dbIds
    const viewport = this.viewer.container.getBoundingClientRect();
    const canvasX = event.clientX - viewport.left;
    const canvasY = event.clientY - viewport.top;

    const result = this.viewer.impl.hitTest(canvasX, canvasY, false);

    if (!result || !result.dbId) return menu;

    // let isWall = false;
    // try {
    //   isWall = await this.isWall(result.dbId);
    // } catch (error) {
    //   isWall = false;
    // }

    await this.onBuildingContextMenuItem(menu, status);
    // if (status.hasSelected && isWall) {
    // menu.push({
    //   title: 'Show current surface temperature map',
    //   target: () => {
    //     $.post(
    //       '/api/walls/temperature',
    //       (response) => {
    //         ViewerUtil.showWallTemperatureMap(response.values);
    //       }
    //     );
    //   }
    // });
    // }

    return menu;
  }

  /**
   * @override
   */
  async show(event) {
    const numSelected = this.viewer.getSelectionCount();
    const visibility = this.viewer.getSelectionVisibility();
    const status = {
      numSelected: numSelected,
      hasSelected: (numSelected > 0),
      hasVisible: visibility.hasVisible,
      hasHidden: visibility.hasHidden
    };
    const menu = await this.buildMenu(event, status);

    this.viewer.runContextMenuCallbacks(menu, status);

    if (menu && menu.length > 0) {
      this.contextMenu.show(event, menu);
    }
  }


  getProperties(model, dbid) {
    return new Promise((resolve, reject) => {
      return model.getProperties(dbid, (res) => {
        resolve(res);
      }, () => {
        reject();
      });
    });
  }
  isObjValid(props) {
    const datasToTest = ['ENS GMAO', 'ID MATERIEL'];
    let countOk = 0;
    for (const prop of props.properties) {
      for (const dataToTest of datasToTest) {
        if (prop.attributeName === dataToTest) {
          if (prop.displayValue === '') return false;
          countOk++;
        }
      }
      if (countOk == datasToTest.length) return true;
    }
    return false;
  }

  async getParentGeo(nodeId) {
    const node = SpinalGraphService.getRealNode(nodeId);
    let parents = await spinalNodeGetParent(node, [EQUIPMENT_RELATION]);
    return parents.filter((e) => {
      return GEO_NODE_TYPE.includes(e.info.type.get());
    })[0];
  }


  async onBuildingContextMenuItem(menu, status) {
    if (status.numSelected !== 1) return;
    console.log('onBuildingContextMenuItem', menu, status);
    const selection = this.viewer.getAggregateSelection();
    console.log(selection);
    const model = selection[0].model;
    const dbId = selection[0].selection[0];
    try {
      const spinalNode = await spinal.BimObjectService.getBIMObject(dbId, model);
      console.log('BimObjectService.getBIMObject', spinalNode);
      if (!spinalNode) return;
      const parent = await this.getParentGeo(spinalNode.info.id.get());
      console.log("parent", parent);
      const props = await this.getProperties(model, dbId);
      console.log("props", props);
      if (this.isObjValid(props)) {
        menu.push({
          title: 'Déclarer un ticket sur cet objet',
          target: () => {
            console.log("clic", parent.info.name.get(), spinalNode.info.name.get());
            spinal.spinalPanelManagerService.openPanel("Ticket Panel Manager", {
              zone: parent.info.id.get(), bimObj: spinalNode.info.id.get()
            });
          }
        });
      } else {
        menu.push({
          title: 'Déclarer un ticket dans cette piece',
          target: () => {
            console.log("clic", parent);
          }
        });

      }
      console.log("Valid Object OK");

    } catch (e) {
      console.error(e);
    }
  }

}

class MyContextMenuExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
  }

  load() {
    // Use my owned context menu.
    this.viewer.setContextMenu(new MyContextMenu(this.viewer));
    return true;
  }

  unload() {
    // Restore default context menu
    this.viewer.setContextMenu(new Autodesk.Viewing.Extensions.ViewerObjectContextMenu(this.viewer));
    return true;
  }
}

// Autodesk.Viewing.theExtensionManager.registerExtension('DemoWallMenuExtension', MyContextMenuExtension);
SpinalForgeExtention.registerExtention('DemoWallMenuExtension', MyContextMenuExtension);
