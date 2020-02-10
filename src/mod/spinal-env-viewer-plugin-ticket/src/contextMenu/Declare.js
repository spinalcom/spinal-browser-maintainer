const TICKET_CONTEXT_MENU = "TICKET_CONTEXT_MENU";
const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import {
  spinalNodeGetParent,
  EQUIPMENT_RELATION,
  GEO_NODE_TYPE,
  REFERENCE_RELATION
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

    console.log("REFERENCE_RELATION", REFERENCE_RELATION);

    let parents = await spinalNodeGetParent(node, [EQUIPMENT_RELATION, REFERENCE_RELATION]);
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
