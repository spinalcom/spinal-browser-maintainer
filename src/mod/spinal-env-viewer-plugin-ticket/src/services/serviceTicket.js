
var throttle = require('lodash.throttle');
const CONTEXT_TICKET_NAME = 'Ticket Service';
const SPINAL_TICKET_SERVICE_STEP_RELATION_NAME = 'SpinalSystemServiceTicketHasStep';
const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME = 'Spinal_Service_Ticket_Process_has_categories_section';
const SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME = 'Spinal_Service_Ticket_Process_has_category';
const SPINAL_RELATION_HAS_BIMOBJ = "hasBimObject";
import {
  spinalNodeGetParent, GEO_RELATIONS_NAMES, FLOOR_TYPE
} from "../vue/TicketDeclareView/GetSpatialContext";
// const RELATION_TICKET_STEP = [
//   SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
//   SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME
// ];
// const states = [{
//   color: '#e1dd04', api: 'ALE - Attente de lect.avant Exécution',
//   label: 'En attente de Validation'
// },
// { color: '#e1dd04', api: '', label: 'En attente de Confirmation' },
// { color: '#04aef2', api: 'ARE - Attente de réalisation', label: 'En attente de réalisation' },
// // 'ENC - En cours de réalisation'
// { color: '#04aef2', api: 'REP - Réalisation partielle', label: 'En réalisation partielle' },
// { color: '#ff0000', api: '', label: 'Refusées' },
// { color: '#5cc037', api: 'CLO - Clôturée', label: 'Terminées' }
// ];
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';

async function getStatus(domaineModel) {
  const statusChildren = await SpinalGraphService.getChildren(domaineModel.id.get(),
    [SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]);

  return statusChildren.map(state => {
    return {
      color: state.color.get(),
      label: state.name.get(),
      id: state.id.get(),
      number: SpinalGraphService.getChildrenIds(state.id.get()).length
    };
  });
}

async function getObjects(domaineModel) {
  const defaultObj = await SpinalGraphService.getChildren(domaineModel.id.get(),
    [SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME]);
  const children = await SpinalGraphService.getChildren(defaultObj[0].id.get(),
    [SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME]);

  return children.map(state => {
    return {
      label: state.name.get(),
      id: state.id.get()
    };
  });
}

function addBindObj(model, cbObj) {
  for (const [m] of cbObj.models) {
    if (m === model) return;
  }
  cbObj.models.push([
    model,
    model.bind(() => {
      cbObj.fct(model, cbObj);
    })
  ]);
}

async function createDomaine(domaineModel, cbObj) {
  addBindObj(SpinalGraphService.getRealNode(domaineModel.id.get()), cbObj);
  const [status, object] = await Promise.all([getStatus(domaineModel),
    getObjects(domaineModel)]);
  return {
    id: domaineModel.id.get(),
    name: domaineModel.name.get(),
    status,
    objects: object
  };
}


async function bindedGetDomaines(model, cbObj) {
  const context = SpinalGraphService.getContext(CONTEXT_TICKET_NAME);
  const children = await SpinalGraphService.getChildrenInContext(context.getId().get(), context.getId().get());
  const res = await Promise.all(children.map((el) => {
    return createDomaine(el, cbObj);
  }));

  cbObj.callback(res);
}

export function getDomaines(callback) {
  window.test = SpinalGraphService;
  const context = SpinalGraphService.getContext(CONTEXT_TICKET_NAME);
  if (!context) {
    throw new Error('no ticket context found !');
  }
  const cb = {
    fct: throttle(bindedGetDomaines, 1000),
    models: [],
    callback
  };
  addBindObj(context, cb);

  return () => {
    for (const [model, proc] of cb.models) {
      model.unbind(proc);
    }
  };
}

var requestCode = {};
requestCode[requestCode["consultDI"] = 0] = "consultDI";
requestCode[requestCode["createDI"] = 1] = "createDI";
requestCode[requestCode["modifyDI"] = 2] = "modifyDI";
requestCode[requestCode["consultBP"] = 3] = "consultBP";
requestCode[requestCode["createBP"] = 4] = "createBP";
requestCode[requestCode["modifyBP"] = 5] = "modifyBP";
export { requestCode };
const rcArr = [
  'consultDI',
  'createDI',
  'modifyDI',
  'consultBP',
  'createBP',
  'modifyBP'
];

export function requestCodeToString(rc) {
  return rcArr[rc];
}

function makeRequestAndWaitResponse(model, requestCode, argRequest) {
  const newRequest = new OrganRequestAltevaRequest(requestCode, argRequest);
  model.queueRequest.push(newRequest);
  return new Promise((resolve) => {
    const modelBinded = newRequest.bind(() => {
      if (typeof newRequest.response !== 'undefined' && newRequest.response.get() !== '') {
        newRequest.unbind(modelBinded);
        resolve(newRequest.response);
      }
    }, false);
  });
}
let getElemPromise = null;
function getContextElement() {
  if (getElemPromise !== null) return getElemPromise;
  getElemPromise = new Promise((resolve, reject) => {
    // resolve(element)
    const context = SpinalGraphService.getContext(CONTEXT_TICKET_NAME);
    if (!context || typeof context.element === 'undefined') {
      getElemPromise = null;
      reject(new Error('no ticket context found !'));
      return;
    }
    resolve(context.getElement());
  });
  return getElemPromise;
}

export function createRequest(requestCode, argRequest) {
  return getContextElement().then((element) => {
    return makeRequestAndWaitResponse(element, requestCode, argRequest);
  }, (err) => { throw err; });
}

const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
let OrganRequestAltevaRequest = spinal_core_connectorjs_type_1.spinalCore._def.OrganRequestAltevaRequest;
if (typeof OrganRequestAltevaRequest === 'undefined') {
  OrganRequestAltevaRequest = class OrganRequestAltevaRequest extends spinal_core_connectorjs_type_1.Model {
    constructor(requestCode, argRequest) {
      super();
      if (typeof requestCode === 'undefined') { return; }
      this.add_attr('requestCode', requestCode);
      this.add_attr('argRequest', argRequest);
      this.add_attr('response', '');
    }
  };
  exports.OrganRequestAltevaRequest = OrganRequestAltevaRequest;
  spinal_core_connectorjs_type_1.spinalCore.register_models(OrganRequestAltevaRequest);
}
export { OrganRequestAltevaRequest };

async function getParentFloor(nodeId) {
  const node = SpinalGraphService.getRealNode(nodeId);
  let parents = await spinalNodeGetParent(node, GEO_RELATIONS_NAMES);
  return parents.filter((e) => FLOOR_TYPE === e.info.type.get())[0];
}

export async function getTicketByDomaineAndStep(domaine, step, onChange) {
  console.log("getTicketByDomaineAndStep", domaine, step);
  const context = SpinalGraphService.getContext(CONTEXT_TICKET_NAME);
  const stepId = step.id;
  const children = await SpinalGraphService.getChildrenInContext(stepId, context.getId().get());
  const res = await Promise.all(children.map(async (el) => {
    const ticket = await el.element.load();
    const localData = {
      name: '-', id: '',
      floor: '-', floorId: ''
    };
    if (ticket.local.get()) {
      const local = SpinalGraphService.getRealNode(ticket.local.get());
      localData.name = local.info.name.get();
      localData.id = local.info.id.get();
      if (local.info.type.get() === FLOOR_TYPE) {
        localData.floor = local.info.name.get();
        localData.floorId = local.info.id.get();
      } else {
        const floor = await getParentFloor(ticket.local.get());
        if (floor) {
          localData.floor = floor.info.name.get();
          localData.floorId = floor.info.id.get();
        }

      }
    }

    return {
      GMAOTicketId: ticket.GMAOTicketId.get(),
      creationDate: new Date(ticket.creationDate.get()),
      equipement: ticket.equipement.get(),
      historiques: ticket.historiques.get(),
      local: localData,
      name: ticket.name.get(),
      note: ticket.note.get()
    };
  }));
  onChange(res);
}

export async function selectTicketLocal(ticket) {
  const local = SpinalGraphService.getRealNode(ticket.local.id);
  const children = await local.getChildren([SPINAL_RELATION_HAS_BIMOBJ]);
  const lstByModel = sortBIMObjectByModel(children);
  const viewer = spinal.SpinalForgeViewer.viewerManager.viewer;
  viewer.clearSelection();
  for (const { model, selection } of lstByModel) {
    model.selector.setSelection(selection, model, "selectOnly");
  }
  viewer.fitToView(lstByModel);
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
