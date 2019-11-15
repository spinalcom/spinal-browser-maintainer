
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

async function loadRelation(spinalNodePointer) {
  return spinalNodePointer.load().then(
    (relation) => {
      return relation.parent.load();
    });
}

function getNodeParent(node, relationNames) {
  const prom = [];

  for (const nodeRelation of node.parents._attribute_names) {
    for (const searchRelation of relationNames) {
      if (nodeRelation === searchRelation) {
        const lst = node.parents[nodeRelation];
        for (var i = 0; i < lst.length; i++) {
          prom.push(loadRelation(lst[i]));
        }
      }
    }
  }
  return Promise.all(prom);
}

/**
 * Recursively finds and return the FIRST FOUND parent nodes for which the predicate is true
 * @export
 * @param {*} startNode spinalNode
 * @param {string[]} relationNames Arry of relation
 * @param {(node)=> boolean} predicate function stop search if return true
 */
export async function findOneParent(startNode, relationNames, predicate) {
  if (predicate(startNode)) {
    return startNode;
  }
  const seen = new Set([startNode]);
  let promises = [];
  let nextGen = [startNode];
  let currentGen = [];

  while (nextGen.length) {
    currentGen = nextGen;
    promises = [];
    nextGen = [];

    for (const node of currentGen) {
      promises.push(getNodeParent(node, relationNames));

      if (predicate(node)) {
        return node;
      }
    }

    // eslint-disable-next-line no-await-in-loop
    const childrenArrays = await Promise.all(promises);

    for (const children of childrenArrays) {
      for (const child of children) {
        if (!seen.has(child)) {
          nextGen.push(child);
          seen.add(child);
        }
      }
    }
  }
}

/**
 * Recursively finds all the parent nodes for which the predicate is true
 * @export
 * @param {*} startNode spinalNode
 * @param {string[]} relationNames Arry of relation
 * @param {(node)=> boolean} predicate Function returning true if the node needs to be returned
 */
export async function findParents(startNode, relationNames, predicate) {
  let found = [];
  if (predicate(startNode)) {
    found.push(startNode);
  }

  const seen = new Set([startNode]);
  let promises = [];
  let nextGen = [startNode];
  let currentGen = [];

  while (nextGen.length) {
    currentGen = nextGen;
    promises = [];
    nextGen = [];

    for (const node of currentGen) {
      promises.push(getNodeParent(node, relationNames));

      if (predicate(node)) {
        found.push(node);
      }
    }

    // eslint-disable-next-line no-await-in-loop
    const childrenArrays = await Promise.all(promises);

    for (const children of childrenArrays) {
      for (const child of children) {
        if (!seen.has(child)) {
          nextGen.push(child);
          seen.add(child);
        }
      }
    }
  }
  return found;
}



window.MY_BIG_TEST = findOneParent;
