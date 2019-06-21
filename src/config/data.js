import geographicService from "spinal-env-viewer-context-geographic-service";
import { SERVICE_NAME, SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME } from "spinal-service-ticket/dist/Constants";
import graph from "./GraphService";

const geographicConstants = geographicService.constants;

let dataService = {
  ContextNode: {},
  ProcessNodes: {},
  StepsNodes: {},
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
  // async bindTicketService(node) {
  //   return new Promise(resolve => {
  //     let context = await graph.SpinalGraphService.getContext(
  //       SERVICE_NAME );
  //   });
  // },
  // bindTicketProcess() {
  //   return new Promise(resolve => {
  //     let context = await graph.SpinalGraphService.getContext(
  //       SERVICE_NAME );
  //   });
  // },
  async getTickets(rooms) {
    await graph.init();

    let context = await graph.SpinalGraphService.getContext(
      SERVICE_NAME );
    if (typeof context === "undefined")
      return Promise.resolve([]);
    this.ContextNode = context;

    let self = this;
    graph.SpinalGraphService.getChildren(context.info.id).then(allProcess => {
      self.getAllSteps(allProcess);
      self.ProcessNodes = allProcess; });

    for (var lvl in rooms)
        for (var room_nbr in rooms[lvl].rooms)
          if (typeof rooms[lvl].rooms[room_nbr].id !== "undefined")
            this.getTicketsPerRoom(lvl, room_nbr, rooms);
    return Promise.resolve([]);

  },
  getAllSteps(allProcess) {
    let self = this;
    for (var process in allProcess) {
      graph.SpinalGraphService.getChildren(allProcess[process].id.get()).then(child => {
        for (var nodeId in child) {
          self.StepsNodes[child[nodeId].id.get()] = graph.SpinalGraphService.getRealNode(child[nodeId].id.get());
        }
      })
    }
  },
  getTicketsPerRoom(lvl, room_nbr, rooms) {
    graph.SpinalGraphService.getChildren(rooms[lvl].rooms[room_nbr].id, SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME)
      .then(children => {
        if (children.length > 0) {
            rooms[lvl].rooms[room_nbr]['tickets'] = [];
            rooms[lvl].rooms[room_nbr]['tickets'] = children.slice(0, children.length);
        }
    })
    },
  async getRooms(floors) {
    await graph.init();

    return Promise.all(floors.map(async el => {

      return {
        floor: el.name,
        rooms: await this.getFloorRooms(el.id)
      };
    }))
  },
  async getEquipments(floors) {
    for (var index in floors)
      for (var floor in floors[index])
        for (var room in floors[index][floor])
          if (typeof floors[index][floor][room].id !== "undefined")
           this.addEquipmentInRoom(floors[index][floor][room].id, floors, index, floor, room);

    return Promise.resolve([]);
  },
  addEquipmentInRoom(id, floor, index, floor_lvl, room) {
    graph.SpinalGraphService.getChildren(id, 'hasBIMObject' ).then(equipmments => { 
      floor[index][floor_lvl][room]['equipements'] = []; 
      floor[index][floor_lvl][room]['equipements'] = equipmments
    });
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
    this.getTickets(rooms);
    this.getEquipments(rooms);
    
    //setTimeout(function() { console.log(rooms, "-", floors)}, 2000);

    return {
      floors: floors,
      rooms: rooms,
      equipements: ''
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
  },

}

export default dataService;