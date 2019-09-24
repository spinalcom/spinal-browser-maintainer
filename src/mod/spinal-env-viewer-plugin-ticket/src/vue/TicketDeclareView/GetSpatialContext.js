import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
// import {constants} from 'spinal-env-viewer-context-geographic-service'

import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service/index';
const CONTEXT_TYPE = "geographicContext";
const SITE_TYPE = "geographicSite";
const BUILDING_TYPE = "geographicBuilding";
export const FLOOR_TYPE = "geographicFloor";
const ZONE_TYPE = "geographicZone";
export const ROOM_TYPE = "geographicRoom";
export const EQUIPMENT_RELATION = "hasBimObject";

const SITE_RELATION = "hasGeographicSite";
const BUILDING_RELATION = "hasGeographicBuilding";
const FLOOR_RELATION = "hasGeographicFloor";
const ZONE_RELATION = "hasGeographicZone";
const ROOM_RELATION = "hasGeographicRoom";
const EQUIPMENT_TYPE = "BIMObject";

export const GEO_RELATIONS_NAMES = [
  SITE_RELATION,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION
];
export const GEO_NODE_TYPE = [
  CONTEXT_TYPE,
  SITE_TYPE,
  BUILDING_TYPE,
  FLOOR_TYPE,
  ZONE_TYPE,
  ROOM_TYPE
];
const GEO_FIND_BIMOBJ_RELATION = [
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  EQUIPMENT_RELATION
];

function modelToObjet(child) {
  if (child.info) {
    return {
      id: child.info.id.get(),
      name: child.info.name.get(),
      type: child.info.type.get()
    };
  }
  return {
    id: child.id.get(),
    name: child.name.get(),
    type: child.type.get()
  };
}

function spinalNodeGetParentRelation(node, relationNames) {
  const res = [];
  for (const relTargetName of relationNames) {
    if (node.parents.hasOwnProperty(relTargetName)) {
      const relLst = node.parents[relTargetName];
      for (let idx = 0; idx < relLst.length; idx++) {
        const relNode = relLst[idx];
        res.push(relNode.load());
      }
    }
  }
  return Promise.all(res);

}

export async function spinalNodeGetParent(node, relationNames) {
  const relations = await spinalNodeGetParentRelation(node, relationNames);
  const res = relations.map((relation) => {
    return relation.parent.load();
  });
  return Promise.all(res);
}

export const GetSpatialContext = {
  getStart() {
    return new Promise((resolve) => {
      const context = SpinalGraphService.getContextWithType(CONTEXT_TYPE)[0];
      return SpinalGraphService.getChildren(context.getId(), GEO_RELATIONS_NAMES).then(
        (contextChildren) => {
          contextChildren = contextChildren.map(modelToObjet);
          resolve(contextChildren);
        }
      );
    });
  },
  async getPrev(nodeId) {
    const node = SpinalGraphService.getRealNode(nodeId);
    let parents = await spinalNodeGetParent(node, GEO_RELATIONS_NAMES);
    parents = parents.filter((elm) => {
      return GEO_NODE_TYPE.includes(elm.info.type.get());
    }).map(modelToObjet);
    if (parents.length === 1) {
      let parent = parents[0];
      const contextChildren = await SpinalGraphService.getChildren(parent.id, GEO_RELATIONS_NAMES);
      return contextChildren.map(modelToObjet);
    }
  },

  getNext(nodeId) {
    return SpinalGraphService.getChildren(nodeId, GEO_RELATIONS_NAMES).then(
      (contextChildren) => {
        return contextChildren.map(modelToObjet);
      }
    );
  },

  async hasAttributes(node, attrToCheck) {
    const attrs = await serviceDocumentation.getAllAttributes(node);
    for (const attr of attrs) {
      if (attr.label.get() === attrToCheck && attr.value.get() !== '') {
        return { res: true, node };
      }
    }
    return { res: false, node };
  },

  async getMaterial(local) {
    const rNode = SpinalGraphService.getRealNode(local.id);
    const resFind = await rNode.find(GEO_FIND_BIMOBJ_RELATION, (obj) => {
      if (obj.getType().get() === EQUIPMENT_TYPE) {
        return true;
      }
      return false;
    });
    const data = await Promise.all(resFind.map((obj) => {
      SpinalGraphService._addNode(obj);
      return this.hasAttributes(obj, 'ID MATERIEL');
    }));
    return data.reduce((acc, e) => {
      if (e.res) {
        acc.push({
          id: e.node.getId().get(),
          name: e.node.getName().get(),
          type: e.node.getType().get()
        });
      }
      return acc;
    }, []);
  }
};
