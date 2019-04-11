import geographicService from "spinal-env-viewer-context-geographic-service"
import graph from "./GraphService";

const geographicConstants = geographicService.constants;

let dataService = {
  async getFloor() {
    await graph.init();

    let context = await graph.SpinalGraphService.getContext(
      geographicConstants
      .FLOOR_REFERENCE_CONTEXT);


    if (typeof context === "undefined")
      return Promise.resolve([]);

    return graph.SpinalGraphService.getChildren(context.info.id.get(), [
      geographicConstants
      .FLOOR_RELATION
    ]).then(children => {

      return children.map(el => {
        return el.get();
      })

    })

  },
  async getRooms(floors) {
    await graph.init();
    return Promise.all(floors.map(async el => {

      return {
        floor: el.id,
        rooms: await this.getFloorRooms(el.id)
      };
    }))
  },
  async getEquipments() {
    await graph.init();
    return []
  },
  getFloorRooms(floorId) {
    return graph.SpinalGraphService.findNodes(floorId, geographicConstants
      .GEOGRAPHIC_RELATIONS, (node) => {
        graph.SpinalGraphService._addNode(node);
        return node.getType().get() === geographicConstants.ROOM_TYPE
      }).then(res => {
      return res.map(el => {
        return el.info.get();
      })
    })
  },
  async getAllData() {

    let floors = await this.getFloor();
    let rooms = await this.getRooms(floors);

    return {
      floors: floors,
      rooms: rooms,
      equipments: await this.getEquipments()
    }
  },
  async getBimObjects(id) {
    await graph.init();

    return graph.SpinalGraphService.findNodes(id, geographicConstants
      .GEOGRAPHIC_RELATIONS, (node) => {
        graph.SpinalGraphService._addNode(node);
        return node.getType().get() === geographicConstants.EQUIPMENT_TYPE
      }).then(res => {

      return res.map(el => {
        return el.info.dbid.get();
      })
    })
  }
}

export default dataService;