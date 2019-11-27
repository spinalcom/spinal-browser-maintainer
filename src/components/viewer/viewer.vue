<template>
  <div class="viewerContainer"
       id="autodesk_forge_viewer">
  </div>
</template>

<script>
import { ForgeViewer } from "spinal-forge-viewer";
import { EventBus } from "../../config/event";

import dataService from "../../config/data";
import GraphService from "../../config/GraphService";
import "spinal-env-viewer-plugin-forge";
import { forgeExtentionManager } from "./ForgeExtentionManager";
import { eventViewerManager } from "./EventViewerManager";
import { viewerUtils } from "./viewerUtils";
export default {
  name: "appViewer",
  data() {
    return {
      viewer: null,
      ticketToZoom: [],
      colors: {},
      materials: {}
    };
  },

  async mounted() {
    const container = document.getElementById("autodesk_forge_viewer");
    this.forgeViewer = new ForgeViewer(container, false);
    forgeExtentionManager.viewer = this.forgeViewer.viewer;
    await this.forgeViewer.start(
      "/models/Resource/3D View/{3D} 341878/{3D}.svf",
      true
    );
    await window.spinal.SpinalForgeViewer.initialize(this.forgeViewer);
    let scenes = await GraphService.getScene();
    await window.spinal.SpinalForgeViewer.loadModelFromNode(
      scenes[0].info.id.get()
    );
    this.viewer = this.forgeViewer.viewer;
    viewerUtils.initViewer(this.forgeViewer.viewer);
    // this.createSetColor();
    // this.createRestoreColor();
    // this.getEvents();
    const exten = forgeExtentionManager.getExtentions();

    exten.forEach(ext => {
      this.forgeViewer.loadExtension(ext);
    });
    // const fitModel = () => {
    //   this.viewer.removeEventListener(
    //     window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
    //     fitModel
    //   );
    //   viewerUtils.fitToView();
    // };
    // this.viewer.addEventListener(
    //   window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
    //   fitModel
    // );
    viewerUtils.fitToView();
    eventViewerManager.init(this.viewer, forgeExtentionManager);

    // // used by
    // const onToolbarCreated = e => {
    //   const settingsTools = this.viewer.toolbar.getControl("settingsTools");
    //   console.log("settingsTools", settingsTools);

    //   settingsTools.removeControl("toolbar-propertiesTool");
    //   this.viewer.removeEventListener(
    //     Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
    //     onToolbarCreated
    //   );
    // };
    // if (!this.viewer.toolbar.isVisible()) {
    //   this.viewer.addEventListener(
    //     Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
    //     onToolbarCreated
    //   );
    // } else {
    //   onToolbarCreated();
    // }
  },
  methods: {
    // getEvents() {
    //   EventBus.$on("click-event", item => this.isolateObjects(item.id));
    //   EventBus.$on("click-ticket-event", item => this.zoomObjects(item.id));
    //   EventBus.$on("display-ticket", item => {
    //     // {floorId: string,
    //     // localId: string,
    //     // color: string,
    //     // materialId: string,}
    //     const knownNodes = GraphService.SpinalGraphService.getNodes();
    //     if (knownNodes[item.floorId]) this.isolateObjects(item.floorId);
    //     if (knownNodes[item.localId]) this.selectObjects(item.localId);
    //     else this.viewer.clearSelection();
    //     if (knownNodes[item.materialId]) {
    //       this.displayTicketsColor([knownNodes[item.materialId]]);
    //     }
    //   });
    //   EventBus.$on("mouse-over", item => this.selectObjects(item.id));
    //   EventBus.$on("select-equipment", itemId => this.selectObjects(itemId));
    //   EventBus.$on("test", id => this.selectObjects(id));
    //   EventBus.$on("select-tickets-room", items => {
    //     this.viewer.clearSelection();
    //     let self = this;
    //     items.forEach(x => self.selectObjects(x.info.id.get()));
    //   });
    //   EventBus.$on("mouse-leave", () => this.viewer.select());
    //   EventBus.$on("click-details", item => {
    //     this.selectObjects(item);
    //     let self = this;
    //     setTimeout(function() {
    //       self.zoomObjects(item);
    //     }, 100);
    //   });
    //   EventBus.$on("click-room", item => this.onClickRoom(item));
    //   EventBus.$on("display-colors", items => this.displayTicketsColor(items));
    //   EventBus.$on("reset-select", () => {
    //     const aggregateIsolation = this.viewer.getAggregateIsolation();
    //     for (const { model } of aggregateIsolation) {
    //       this.viewer.isolate(0, model);
    //     }
    //     this.viewer.fitToView(0);
    //   });
    // },
    // createSetColor() {
    //   let _self = this;
    //   this.viewer.setColorMaterial = function(objectIds, color) {
    //     for (var i = 0; i < objectIds.length; i++) {
    //       var dbid = objectIds[i];
    //       if (_self.materials[dbid]) {
    //         _self.materials[dbid].color.setHex(
    //           parseInt(_self.cutHex(color), 16)
    //         );
    //         _self.viewer.impl.invalidate(false, false, true);
    //       } else {
    //         var material = _self.addMaterial(color, dbid);
    //         let it = _self.viewer.model.getData().instanceTree;
    //         it.enumNodeFragments(
    //           dbid,
    //           function(fragId) {
    //             var renderProxy = _self.viewer.impl.getRenderProxy(
    //               _self.viewer.model,
    //               fragId
    //             );
    //             renderProxy[dbid] = new THREE.Mesh(
    //               renderProxy.geometry,
    //               material
    //             );
    //             renderProxy[dbid].matrix.copy(renderProxy.matrixWorld);
    //             renderProxy[dbid].matrixWorldNeedsUpdate = true;
    //             renderProxy[dbid].matrixAutoUpdate = false;
    //             renderProxy[dbid].frustumCulled = false;
    //             _self.viewer.impl.addOverlay(dbid, renderProxy[dbid]);
    //             _self.viewer.impl.invalidate(true);
    //           },
    //           false
    //         );
    //       }
    //     }
    //   };
    // },
    // cutHex(h) {
    //   return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    // },
    // addMaterial(color, id) {
    //   let _self = this;
    //   this.materials[id] = new THREE.MeshPhongMaterial({
    //     color: color
    //   });
    //   this.viewer.impl.createOverlayScene(
    //     id,
    //     _self.materials[id],
    //     _self.materials[id]
    //   );
    //   return _self.materials[id];
    // },
    // createRestoreColor() {
    //   let _self = this;
    //   this.viewer.restoreColorMaterial = function(objectIds) {
    //     for (var i = 0; i < objectIds.length; i++) {
    //       var dbid = objectIds[i];
    //       var it = _self.viewer.model.getData().instanceTree;
    //       if (_self.materials[dbid]) delete _self.materials[dbid];
    //       it.enumNodeFragments(
    //         dbid,
    //         function(fragId) {
    //           var renderProxy = _self.viewer.impl.getRenderProxy(
    //             _self.viewer.model,
    //             fragId
    //           );
    //           if (renderProxy[dbid]) {
    //             _self.viewer.impl.clearOverlay(dbid);
    //             delete renderProxy[dbid];
    //             _self.viewer.impl.invalidate(true);
    //           }
    //         },
    //         true
    //       );
    //     }
    //   };
    // },
    // // selectObjects(id) {
    // //   selectObjectsByNodeId(this.viewer, id);
    // //   // dataService.getBimObjectByModel(id).then(lstByModel => {
    // //   //   this.viewer.clearSelection();
    // //   //   for (const { model, selection } of lstByModel) {
    // //   //     model.selector.setSelection(selection, model, "selectOnly");
    // //   //   }
    // //   // });
    // // },
    // // async onClickRoom(roomId, floorId) {
    // //   await rotateTo(this.viewer, "top");
    // //   await isolateObjectsByNodeId(this.viewer, roomId);
    // //   await fitObjectsByNodeId(this.viewer, floorId);
    // // },
    // // zoomObjects(id) {
    // //   let selection = this.viewer.getAggregateSelection();
    // //   this.viewer.fitToView(selection);
    // // },
    // displayTicketsColor(items) {
    //   let realNode;
    //   this.ticketToZoom = [];
    //   this.colors = {};
    //   let iterator = 0;
    //   const prom = [];
    //   for (var node in items) {
    //     if (!items[node].info.local.get()) {
    //       // << GROS SCOTCH
    //       console.log("unknow location ticket ", items[node]); // << GROS SCOTCH
    //       continue; // << GROS SCOTCH
    //     } // << GROS SCOTCH
    //     realNode = spinal.spinalGraphService.getRealNode(
    //       items[node].info.local.get()
    //     );
    //     this.colors[iterator] = items[node].info.color.get();
    //     iterator++;
    //     prom.push(
    //       realNode
    //         .find(
    //           ["hasBimObject", "hasBIMObject", "hasReferenceObject"],
    //           this.predicat
    //         )
    //         .then(lst => {
    //           let result = lst.map(function(x) {
    //             return x.info.dbid.get();
    //           });
    //           this.ticketToZoom.push(result);
    //           return lst;
    //         })
    //     );
    //   }
    //   Promise.all(prom)
    //     .then(arrLst => {
    //       if (arrLst.length > 0 && arrLst[0].length > 0) {
    //         const id = arrLst[0][0].info.bimFileId.get();
    //         const model = spinal.BimObjectService.getModelByBimfile(id);
    //         return spinal.SpinalForgeViewer.viewerManager.setCurrentModel(
    //           model
    //         );
    //       }
    //     })
    //     .then(() => {
    //       window.addEventListener("click", this.eventForColor, true);
    //       this.setColorMaterial();
    //     })
    //     .catch(console.error);
    // },
    // predicat: function(node) {
    //   return node.info.type.get() === "BIMObject";
    // },
    // eventForColor: function(event) {
    //   for (var i in this.ticketToZoom) {
    //     this.viewer.restoreColorMaterial(this.ticketToZoom[i]);
    //   }
    //   window.removeEventListener("click", this.eventForColor, true);
    //   event.preventDefault();
    // },
    // setColorMaterial: function() {
    //   let self = this;
    //   var iterator = 0;
    //   let color;
    //   let loop = 0;
    //   var x = setInterval(function() {
    //     if (self.colors[iterator]) {
    //       // << GROS SCOTCH
    //       color = self.colors[iterator].replace(/#/g, "0x");
    //       self.viewer.setColorMaterial(self.ticketToZoom[iterator], color);
    //       iterator++;
    //       if (self.ticketToZoom[iterator] === undefined && loop === 0) {
    //         iterator = 0;
    //         loop = 1;
    //       } else if (self.ticketToZoom[iterator] === undefined && loop === 1) {
    //         clearInterval(x);
    //       }
    //     } else {
    //       // << GROS SCOTCH
    //       clearInterval(x); // << GROS SCOTCH
    //     } // << GROS SCOTCH
    //   }, 10);
    // }
    // isolateObjects(id) {
    //   console.log("isolateObjects", id);
    //   dataService.getBimObjectByModel(id).then(lstByModel => {
    //     for (const { model, selection } of lstByModel) {
    //       if (selection.length > 0) {
    //         this.viewer.isolate(selection, model);
    //       } else {
    //         model.getObjectTree(tree => {
    //           let dbidRoot = tree.nodeAccess.dbIdToIndex[model.getRootId()];
    //           self.viewer.isolate([dbidRoot], model);
    //         });
    //       }
    //     }
    //     this.viewer.fitToView(lstByModel);
    //   });
    //   // dataService.getBimObjects(id).then(res => {
    //   //   this.viewer.isolate(res);
    //   //   this.viewer.fitToView(res);
    //   //   return;
    //   // });
    // },
    // setCameraToTopView() {}
  }
};
</script>

<style scoped>
.viewerContainer {
  position: relative;
}
</style>
