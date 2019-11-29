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

import { EventBus } from "../../config/event";
import GraphService from "../../config/GraphService";
import { viewerUtils } from "./viewerUtils";
import throttle from 'lodash.throttle';
import { SPINAL_TICKET_SERVICE_STEP_RELATION_NAME } from "spinal-service-ticket/dist/Constants";

export class EventViewerManager {
  init(viewer) {
    this.viewer = viewer;
    this.initEvt();
  }
  initEvt() {
    //   EventBus.$on("click-event", item => this.isolateObjects(item.id));
    //   EventBus.$on("click-ticket-event", item => this.zoomObjects(item.id));
    EventBus.$on("display-ticket", throttle(this.displayTicket.bind(this), 50));

    EventBus.$on("mouse-over", throttle(this.onMouseOverSideBar.bind(this), 50));
    EventBus.$on("click-room", throttle(this.onClickRoom.bind(this), 1000));
    EventBus.$on("mouse-leave", () => this.viewer.select());
    EventBus.$on("show-floor", throttle(this.showFloor.bind(this), 1000));
    EventBus.$on("show-bat", throttle(this.showBuildind.bind(this), 1000));
    // show-floor
    // show-bat
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
    //     setTimeout(function () {
    //       self.zoomObjects(item);
    //     }, 100);
    //   });


    //   EventBus.$on("display-colors", items => this.displayTicketsColor(items));

    //   EventBus.$on("reset-select", () => {
    //     const aggregateIsolation = this.viewer.getAggregateIsolation();
    //     for (const { model } of aggregateIsolation) {
    //       this.viewer.isolate(0, model);
    //     }
    //     this.viewer.fitToView(0);
    //   });

  }
  onMouseOverSideBar(item) {
    viewerUtils.selectObjectsByNodeId(item.id);
  }
  async onClickRoom({ select, floor, noSelect }) {
    let selection, floorSelected;
    if (select.id === floor) {
      selection = floorSelected = await viewerUtils.getBimObjectByModel(floor);
    }
    else {
      [selection, floorSelected] = await Promise.all([
        viewerUtils.getBimObjectByModel(select.id),
        viewerUtils.getBimObjectByModel(floor)
      ]);
    }
    viewerUtils.isolateObjects(floorSelected);
    await viewerUtils.rotateTo('top');
    if (!noSelect) viewerUtils.selectObjects(selection);
    viewerUtils.fitObjects(selection);
  }
  async showBuildind() {
    const face = 'front,top,right';
    viewerUtils.showAll();
    await viewerUtils.rotateTo(face);
    viewerUtils.fitObjects();
  }
  async showFloor(floor) {
    const floorSelected = await viewerUtils.getBimObjectByModel(floor);
    viewerUtils.isolateObjects(floorSelected);
    await viewerUtils.rotateTo('top');
    viewerUtils.fitObjects(floorSelected);
  }
  async displayTicket(item) {
    // {floorId: string,
    // localId: string,
    // color: string,
    // materialId: string,}
    const knownNodes = GraphService.SpinalGraphService.getNodes();
    if (knownNodes[item.floorId]) {
      await Promise.all([
        viewerUtils.isolateObjectsByNodeId(item.floorId),
        viewerUtils.rotateTo('top')]);
    }
    // if (knownNodes[item.localId]) await viewerUtils.selectObjectsByNodeId(item.localId);
    // else this.viewer.clearSelection();
    // if (knownNodes[item.materialId]) {
    //   this.displayTicketsColor([knownNodes[item.materialId]]);
    // }
    if (knownNodes[item.localId]) {
      const local = await viewerUtils.getBimObjectByModel(item.localId);
      if (item.fit) {
        viewerUtils.fitObjects(local);
      } else {
        viewerUtils.fitObjectsByNodeId(item.floorId);
      }


      viewerUtils.selectObjects(local);


      // await viewerUtils.fitObjectsByNodeId(item.localId);
      // const children = await knownNodes[item.localId].getChildren(['hasBimObject', 'hasBIMObject']);
      // const items = await viewerUtils.getBimObjectByModel(item.localId);
      // const matId = parseInt(item.materialId, 10);
      // const list = await Promise.all(children.map((node) => {
      //   return this.getMatIdFromNode(node);
      // })); // CONTUNUE
      // await viewerUtils.displayTicketsColor();
      // await viewerUtils.displayTicketsColor([knownNodes[item.localId]]);
    } else {
      if (knownNodes[item.floorId]) {
        const floor = await viewerUtils.getBimObjectByModel(item.floorId);
        viewerUtils.isolateObjects(floor);
        viewerUtils.fitObjects(floor);
      }
      this.viewer.clearSelection();
    }

  }
  getMatIdFromNode(node) {
    return node.getChildren([SPINAL_TICKET_SERVICE_STEP_RELATION_NAME])
      .then((attCats) => {
        return Promise.all(attCats.map((attCat) => attCat.getElement()));
      }).then((attrsLst) => {
        for (const attrs of attrsLst) {
          for (const attr of attrs) {
            if (attr.label.get() === 'ID_Materiel' &&
              attr.value.get() !== '-') return attr.value;
          }
        }
      });
  }
}

export const eventViewerManager = new EventViewerManager();
export default eventViewerManager;
