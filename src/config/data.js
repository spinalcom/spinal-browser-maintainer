import geographicService from "spinal-env-viewer-context-geographic-service";
import {
  SERVICE_NAME,
  SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_STEP_RELATION_NAME
} from "spinal-service-ticket/dist/Constants";
import graph from "./GraphService";

const geographicConstants = geographicService.constants;

function getOrAddModelIfMissing(array, model) {
  for (const obj of array) {
    if (obj.model === model) {
      return obj;
    }
  }
  const obj = {
    selection: [],
    model
  };
  array.push(obj);
  return obj;
}

function sortBIMObjectByModel(arrayOfBIMObject) {
  let arrayModel = [];
  for (const nodeBIMObject of arrayOfBIMObject) {
    const bimFileId = nodeBIMObject.info.bimFileId.get();
    const dbId = nodeBIMObject.info.dbid.get();
    const model = spinal.BimObjectService.getModelByBimfile(bimFileId);
    const obj = getOrAddModelIfMissing(arrayModel, model);
    obj.selection.push(dbId);
  }
  return arrayModel;
}




let dataService = {
  ContextNode: {},
  ProcessNodes: {},
  StepsNodes: {},
  TicketsNodes: {},
  total: {},
  async getFloor() {
    await graph.init();
    let context = await graph.SpinalGraphService.getContext(
      geographicConstants
        .FLOOR_REFERENCE_CONTEXT);


    if (typeof context === "undefined") { return Promise.resolve([]); }

    return graph.SpinalGraphService.getChildren(context.info.id.get(), [
      geographicConstants.FLOOR_RELATION
    ]).then(children => {

      return children.map(el => {
        return el.get();
      });

    });

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


  getTicketFromSteps(steps) {
    const promises = [];
    for (const { step, process } of steps) {
      promises.push(graph.SpinalGraphService.getChildren(step.info.id.get())
        .then((tickets) => {
          // for (const ticket of tickets) {
          return tickets.map((nodeId) => {
            const ticket = graph.SpinalGraphService.getRealNode(nodeId.id.get());
            this.TicketsNodes[nodeId.id.get()] = ticket;
            return { ticket, step, process };
          });
        }));
    }
    return Promise.all(promises);
  },
  assignTicketToRoom(ticket, floors) {
    for (const floor of floors) {
      for (const room of floor.rooms) {
        if (room.id === ticket.ticket.info.local.get()) {
          floor.count += 1;
          if (typeof room.tickets === 'undefined') room.tickets = [];
          room.tickets.push(ticket);
          return;
        }
      }
    }

  },
  getTicketsPerRoom(tickets, floors) {
    // return graph.SpinalGraphService
    //   .getChildren(room.id, SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME)
    //   .then(children => {
    //     if (children.length > 0) {
    //       floor.count += children.length;
    //       room.tickets = children.slice(0, children.length);
    //       // this.addInfoToTicket(room.tickets, processInfo);
    //     }
    //   });
    for (const ticketFloor of tickets) {
      for (const ticketRoom of ticketFloor) {
        for (const ticket of ticketRoom) {
          this.assignTicketToRoom(ticket, floors);
        }
      }
    }

  },
  async getTickets(rooms, processInfo) {
    await graph.init();
    let context = await graph.SpinalGraphService.getContext(SERVICE_NAME);
    if (typeof context === "undefined") { return Promise.resolve([]); }
    this.ContextNode = context;
    const allProcess = await graph.SpinalGraphService.getChildren(context.info.id);

    const steps = await this.getAllSteps(allProcess);
    this.ProcessNodes = allProcess;
    const allTickets = await Promise.all(steps.map((e) => {
      return this.getTicketFromSteps(e);
    }));
    for (const floor of rooms) {
      floor.count = 0;
    }
    this.getTicketsPerRoom(allTickets, rooms);
    // this.getProcessByLevel(rooms);
    // return Promise.resolve([]);
    return allTickets;
  },
  // getProcessByLevel(floor) {
  //   setTimeout(function () {

  //     for (var level in floor) {
  //       for (var ticket in floor[level].rooms) {
  //         if (floor[level].rooms[ticket].tickets !== undefined) {
  //           floor[level]['processNumber'] = {};
  //           for (var el in floor[level].rooms[ticket].tickets) {
  //             if (floor[level].rooms[ticket].tickets[el]['processName'] !== undefined) {
  //               if (floor[level]['processNumber'][floor[level].rooms[ticket].tickets[el]['processName']] === undefined) {
  //                 floor[level]['processNumber'][floor[level].rooms[ticket].tickets[el]['processName']] = 1;
  //               }
  //               else {
  //                 floor[level]['processNumber'][floor[level].rooms[ticket].tickets[el]['processName']] =
  //                   floor[level]['processNumber'][floor[level].rooms[ticket].tickets[el]['processName']] + 1;
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }

  //   }, 3000);
  // },
  getAllSteps(allProcess) {
    const promises = [];
    for (var process of allProcess) {
      const processNode = graph.SpinalGraphService.getRealNode(process.id.get());
      promises.push(graph.SpinalGraphService.getChildren(process.id.get(),
        [SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]).then(child => {
        return child.map((nodeId) => {
          const node = graph.SpinalGraphService.getRealNode(nodeId.id.get());
          this.StepsNodes[nodeId.id.get()] = node;
          return { step: node, process: processNode };
        });
      }));
    }
    return Promise.all(promises);
  },
  // getTicketsPerRoom(lvl, room_nbr, rooms, processInfo) {
  //   // console.log('getTicketsPerRoom', lvl, room_nbr, rooms, processInfo,
  //   //   graph.SpinalGraphService.getRealNode(rooms[lvl].rooms[room_nbr].id), SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME);

  //   return graph.SpinalGraphService
  //     .getChildren(rooms[lvl].rooms[room_nbr].id, SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME)
  //     .then(children => {
  //       if (children.length > 0) {
  //         rooms[lvl]['count'] = children.length;
  //         rooms[lvl].rooms[room_nbr]['tickets'] = [];
  //         rooms[lvl].rooms[room_nbr]['tickets'] = children.slice(0, children.length);
  //         this.addInfoToTicket(children.slice(0, children.length), processInfo);
  //       }
  //     });
  // },
  addInfoToTicket(tickets, processInfo) {
    let processe;
    this.total['count'] = {};
    let self = this;
    setTimeout(function () {
      for (var ticket in tickets) {
        processe = graph.SpinalGraphService.getRealNode(tickets[ticket].processId.get());

        if (processe !== undefined) {
          if (self.total['count'][processe.info.name.get()] === undefined) {
            self.total['count'][processe.info.name.get()] = 1;
          }
          else {
            self.total['count'][processe.info.name.get()] = self.total['count'][processe.info.name.get()] + 1;
          }
        }
      }
    }, 2000);
  },
  async getRooms(floors) {
    await graph.init();

    return Promise.all(floors.map(async el => {

      return {
        floor: el.name,
        rooms: await this.getFloorRooms(el.id)
      };
    }));
  },
  async getEquipments(floors) {
    for (var index in floors) {
      for (var floor in floors[index]) {
        for (var room in floors[index][floor]) {
          if (typeof floors[index][floor][room].id !== "undefined") { this.addEquipmentInRoom(floors[index][floor][room].id, floors, index, floor, room); }
        }
      }
    }

    return Promise.resolve([]);
  },
  addEquipmentInRoom(id, floor, index, floor_lvl, room) {
    graph.SpinalGraphService.getChildren(id, 'hasBIMObject').then(equipmments => {
      floor[index][floor_lvl][room]['equipements'] = [];
      floor[index][floor_lvl][room]['equipements'] = equipmments;
    });
  },
  getFloorRooms(floorId) {
    return graph.SpinalGraphService.findNodes(floorId, geographicConstants
      .GEOGRAPHIC_RELATIONS, (node) => {
      graph.SpinalGraphService._addNode(node);
      return node.getType().get() === geographicConstants.ROOM_TYPE;
    }).then(res => {
      return res.map(el => {
        return el.info.get();
      });
    });
  },
  getProcessName(obj) {
    let allProcess = [];
    let icons = [];
    obj['process'] = allProcess;
    obj['icon'] = icons;
    let self = this;
    setTimeout(function () {
      for (var node in self.ProcessNodes) {
        allProcess.push(self.ProcessNodes[node].name.get());
        try {
          icons[self.ProcessNodes[node].name.get()] = self.ProcessNodes[node].icon.get();
        } catch (e) {
          icons[self.ProcessNodes[node].name.get()] = 'appartement';
        }
      }
    }, 2000);
  },
  async getAllData() {
    let processName = {};

    let floors = await this.getFloor();
    let rooms = await this.getRooms(floors);
    let ticketsByProcess = await this.getTickets(rooms, processName);
    this.getEquipments(rooms);
    this.getProcessName(processName);

    return {
      floors: floors,
      rooms: rooms,
      process: processName['process'],
      processIcons: processName['icon'],
      totalTickets: this.total,
      equipements: '',
      ticketsByProcess
    };
  },
  async getBimObjects(id) {
    console.warn("deprecated don't use 'getBimObjects' use 'getBimObjectByModel'");
    await graph.init();
    return graph.SpinalGraphService.findNodes(id, geographicConstants
      .GEOGRAPHIC_RELATIONS, (node) => {
      graph.SpinalGraphService._addNode(node);
      return node.getType().get() === geographicConstants.EQUIPMENT_TYPE;
    }).then(res => {
      return res.map(el => {
        return el.info.dbid.get();
      });
    });
  },

  async getBimObjectByModel(id) {
    await graph.init();
    return graph.SpinalGraphService.findNodes(id, geographicConstants
      .GEOGRAPHIC_RELATIONS, (node) => {
      return node.getType().get() === geographicConstants.EQUIPMENT_TYPE;
    }).then((res) => {
      for (const bimobjNode of res) {
        graph.SpinalGraphService._addNode(bimobjNode);
      }
      return sortBIMObjectByModel(res);
    });
  }

};

export default dataService;
