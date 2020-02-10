const temp1 = {
  context: {},
  graph: {},
  selectedNode: {}
};
function renameChildId(temp1) {
  let selectedNode = spinal.spinalGraphService.getRealNode(temp1.selectedNode.id.get());
  let context = spinal.spinalGraphService.getRealNode(temp1.context.id.get());

  selectedNode.getChildrenInContext(context).then((lst) => {

    for (const child of lst) {
      const name = child.info.name.get();
      var nodeName = name.substr(0, name.length - 2);
      var id = name.substr(name.length - 2);
      child.info.name.set(`${id}-${nodeName}`);
    }
  });

}
const temp5 = [{
  info: {
    name: {
      get() { }
    }
  }
}];


function sortLst(lst) {
  var tmp = [];
  for (let idx = 0; idx < lst.length; idx++) {
    tmp.push(lst[idx]);
  }
  tmp.sort((a, b) => {
    return a.info.name.get().localeCompare(b.info.name.get());
  });
  lst.clear();
  tmp.forEach(el => {
    lst.push(el);
  });
}
