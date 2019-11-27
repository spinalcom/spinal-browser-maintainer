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
import dataService from "../../config/data";

const validNames = [
  "top", 'front', "right", "left", "back", 'bottom',
  "top,front", "top right", "top,left", "top,back",
  "bottom,front", "bottom,right", "bottom,left", "bottom,back",
  "left,front", "front,right", "right,back", "back,left",
  "front,top,right", "back,top,right", "front,top,left",
  "back,top,left", "front,bottom,right", "back,bottom,right",
  "front,bottom,left", "back,bottom,left"];


export class ViewerUtils {
  constructor() {
    this.eventForColorBinded = this.eventForColor.bind(this);
  }
  initViewer(viewer) {
    this.viewer = viewer;
  }

  _rotateTo(viewer, face) {
    return new Promise((resolve, reject) => {
      if (!validNames.includes(face)) {
        return reject();
      }
      if (face === 'top') {
        if (viewer.getCamera().rotation.x == 0 &&
          viewer.getCamera().rotation.y == 0 &&
          viewer.getCamera().rotation.z == 0) return resolve();
      }
      this.currentFace = face;
      if (viewer.autocam.orthographicFaces && (this.currentFace.indexOf(',') !== -1)) {
        viewer.autocam.setCameraOrtho(false);
      }
      viewer.autocam.calculateCubeTransform(this.currentFace);
      viewer.autocam.elapsedTime = 0;
      viewer.autocam.sphericallyInterpolateTransition(() => {
        if (this.mouseMoveSave) { this.processMouseMove(this.mouseMoveSave); }
        resolve();
      });
    });
  }

  rotateTo(face) {
    return this._rotateTo.call(this.viewer.viewCubeUi.cube, this.viewer, face);
  }

  fitToView(selections) {
    this.viewer.fitToView(selections);
  }
  clearSelection() {
    this.viewer.clearSelection();
  }
  selectObjectsByNodeId(nodeId) {
    return dataService.getBimObjectByModel(nodeId).then(lstByModel => {
      return this.selectObjects(lstByModel);
    });
  }

  isolateObjectsByNodeId(nodeId) {
    return dataService.getBimObjectByModel(nodeId).then(lstByModel => {
      return this.isolateObjects(lstByModel);
    });
  }

  fitObjectsByNodeId(nodeId) {
    return dataService.getBimObjectByModel(nodeId).then(lstByModel => {
      return this.fitObjects(lstByModel);
    });
  }

  getBimObjectByModel(nodeId) {
    return dataService.getBimObjectByModel(nodeId);
  }
  selectObjects(lstByModel) {
    this.clearSelection();
    for (const { model, selection } of lstByModel) {
      model.selector.setSelection(selection, model, "selectOnly");
    }
  }
  isolateObjects(lstByModel) {
    for (const { model, selection } of lstByModel) {
      if (selection.length > 0) {
        this.viewer.isolate(selection, model);
      } else {
        model.getObjectTree(tree => {
          let dbidRoot = tree.nodeAccess.dbIdToIndex[model.getRootId()];
          this.viewer.isolate([dbidRoot], model);
        });
      }
    }
  }

  fitObjects(lstByModel) {
    this.viewer.fitToView(lstByModel);
  }
  showAll() {
    this.viewer.showAll();
  }
  restoreColorMaterial(objectIds) {
    for (var i = 0; i < objectIds.length; i++) {
      var dbid = objectIds[i];

      var it = this.viewer.model.getData().instanceTree;

      if (this.materials[dbid]) delete this.materials[dbid];

      it.enumNodeFragments(dbid, (fragId) => {
        var renderProxy = this.viewer.impl.getRenderProxy(
          this.viewer.model,
          fragId
        );
        if (renderProxy[dbid]) {
          this.viewer.impl.clearOverlay(dbid);
          delete renderProxy[dbid];
          this.viewer.impl.invalidate(true);
        }
      }, true);
    }
  }
  setColorMaterial(objectIds, color) {
    for (var i = 0; i < objectIds.length; i++) {
      var dbid = objectIds[i];
      if (this.materials[dbid]) {
        this.materials[dbid].color.setHex(
          parseInt(this.cutHex(color), 16)
        );
        this.viewer.impl.invalidate(false, false, true);
      } else {
        var material = this.addMaterial(color, dbid);

        let it = this.viewer.model.getData().instanceTree;
        it.enumNodeFragments(dbid, (fragId) => {
          var renderProxy = this.viewer.impl.getRenderProxy(this.viewer.model, fragId);
          renderProxy[dbid] = new THREE.Mesh(renderProxy.geometry, material);
          renderProxy[dbid].matrix.copy(renderProxy.matrixWorld);
          renderProxy[dbid].matrixWorldNeedsUpdate = true;
          renderProxy[dbid].matrixAutoUpdate = false;
          renderProxy[dbid].frustumCulled = false;
          this.viewer.impl.addOverlay(dbid, renderProxy[dbid]);
          this.viewer.impl.invalidate(true);
        }, false);
      }
    }
  }
  cutHex(h) {
    return h.charAt(0) == "#" ? h.substring(1, 7) : h;
  }
  addMaterial(color, id) {
    this.materials[id] = new THREE.MeshPhongMaterial({
      color: color
    });

    this.viewer.impl.createOverlayScene(id, this.materials[id], this.materials[id]);
    return this.materials[id];
  }
  displayTicketsColor(items) {
    let realNode;
    this.ticketToZoom = [];
    this.colors = {};
    let iterator = 0;
    const prom = [];
    for (var node in items) {
      if (!items[node].info.local.get()) {
        // << GROS SCOTCH
        console.log("unknow location ticket ", items[node]); // << GROS SCOTCH
        continue; // << GROS SCOTCH
      } // << GROS SCOTCH
      realNode = spinal.spinalGraphService.getRealNode(
        items[node].info.local.get()
      );
      this.colors[iterator] = items[node].info.color.get();
      iterator++;
      prom.push(realNode.find(["hasBimObject", "hasBIMObject", "hasReferenceObject"],
        this.predicat
      ).then(lst => {
        let result = lst.map((x) => {
          return x.info.dbid.get();
        });
        this.ticketToZoom.push(result);
        return lst;
      }));
    }
    Promise.all(prom)
      .then(arrLst => {
        if (arrLst.length > 0 && arrLst[0].length > 0) {
          const id = arrLst[0][0].info.bimFileId.get();
          const model = spinal.BimObjectService.getModelByBimfile(id);
          return spinal.SpinalForgeViewer.viewerManager.setCurrentModel(model);
        }
      })
      .then(() => {
        window.addEventListener("click", this.eventForColorBinded, true);
        this.setColorMaterialS();
      })
      .catch(console.error);
  }
  predicat(node) {
    return node.info.type.get() === "BIMObject";
  }
  eventForColor(event) {
    for (var i in this.ticketToZoom) {
      this.restoreColorMaterial(this.ticketToZoom[i]);
    }
    window.removeEventListener("click", this.eventForColorBinded, true);
    event.preventDefault();
  }
  setColorMaterialS() {
    let self = this;
    var iterator = 0;
    let color;
    let loop = 0;
    var x = setInterval(() => {
      if (self.colors[iterator]) {
        // << GROS SCOTCH
        color = self.colors[iterator].replace(/#/g, "0x");
        this.setColorMaterial(self.ticketToZoom[iterator], color);
        iterator++;
        if (self.ticketToZoom[iterator] === undefined && loop === 0) {
          iterator = 0;
          loop = 1;
        } else if (self.ticketToZoom[iterator] === undefined && loop === 1) {
          clearInterval(x);
        }
      } else {
        // << GROS SCOTCH
        clearInterval(x); // << GROS SCOTCH
      } // << GROS SCOTCH
    }, 10);
  }

}


export const viewerUtils = new ViewerUtils();
