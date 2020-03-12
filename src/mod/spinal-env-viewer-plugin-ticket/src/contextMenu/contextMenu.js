/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
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
    const datasToTest = ['ID MATERIEL', 'ID_Materiel'];
    let countOk = 0;
    for (const prop of props.properties) {
      for (const dataToTest of datasToTest) {
        if (prop.attributeName === dataToTest) {
          if (prop.displayValue === '') return false;
          countOk++;
        }
      }
      if (countOk > 0) return true;
    }
    return false;
  }

  async getParentGeo(nodeId) {
    const node = SpinalGraphService.getRealNode(nodeId);
    let parents = await spinalNodeGetParent(node, [EQUIPMENT_RELATION, REFERENCE_RELATION]);
    return parents.filter((e) => {
      return GEO_NODE_TYPE.includes(e.info.type.get());
    })[0];
  }


  async onBuildingContextMenuItem(menu, status) {
    if (status.numSelected !== 1) return;
    const selection = this.viewer.getAggregateSelection();
    const model = selection[0].model;
    const dbId = selection[0].selection[0];
    try {
      const spinalNode = await spinal.BimObjectService.getBIMObject(dbId, model);
      if (!spinalNode) return;
      const parent = await this.getParentGeo(spinalNode.id.get());
      const props = await this.getProperties(model, dbId);
      if (this.isObjValid(props)) {
        menu.push({
          title: 'Déclarer un ticket sur cet objet',
          target: () => {
            spinal.spinalPanelManagerService.openPanel("Ticket Panel Manager", {
              local: parent.info.id.get(), bimObj: spinalNode.id.get()
            });
          }
        });
      } else {
        menu.push({
          title: 'Déclarer un ticket dans cette piece',
          target: () => {
            spinal.spinalPanelManagerService.openPanel("Ticket Panel Manager", {
              local: parent.info.id.get()
            });
          }
        });
      }
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
