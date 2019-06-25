<template>
  <div class="viewerContainer"
       id="autodesk_forge_viewer">

  </div>

</template>


<script>
// import Vue from "vue";
import ForgeViewer from "./forgeViewer";
import { EventBus } from "../../config/event";

import dataService from "../../config/data";
import { setTimeout } from "timers";
import graph from "../../config/GraphService"

let forgeViewer = new ForgeViewer();

export default {
  name: "appViewer",
  // props: ["collapseMenu"],
  data() {
    return {
      viewer: null,
      ticketToZoom: {},
      colors: {},
      materials: {}
    };
  },
  async mounted() {
    this.getEvents();

    await forgeViewer.start_viewer(
      document.getElementById("autodesk_forge_viewer")
    );
    this.viewer = forgeViewer.viewer;
    this.createSetColor();
    this.createRestoreColor();
  },
  methods: {
    getEvents() {
      EventBus.$on("click-event", item => this.isolateObjects(item.id) );

      EventBus.$on("click-ticket-event", item => this.zoomObjects(item.id) );

      EventBus.$on("mouse-over", item => this.selectObjects(item.id) );

      EventBus.$on("select-equipment", itemId => this.selectObjects(itemId) );

      EventBus.$on("select-tickets-room", items => 
      {
        this.viewer.clearSelection();
        let self = this;
        items.forEach(x => self.selectObjects(x.info.id.get()));
      });

      EventBus.$on("mouse-leave", () => this.viewer.select() );

      EventBus.$on("click-room", item => this.zoomObjects(item) );

      EventBus.$on("display-colors", items => this.displayTicketsColor(items) );

      EventBus.$on("reset-select", () => {
        this.viewer.isolate(0);
        this.viewer.fitToView(0); 
      });
    },
    createSetColor() {
      let _self = this;
      this.viewer.setColorMaterial = function(
      objectIds,
      color
    ) {
        console.log("setcolor", objectIds, color);
        for (var i = 0; i < objectIds.length; i++) {
          var dbid = objectIds[i];


          if (_self.materials[dbid]) {
            _self.materials[dbid].color.setHex(parseInt(_self.cutHex(color),
              16));
            _self.viewer.impl.invalidate(false, false, true);
          } else {
            var material = _self.addMaterial(color, dbid);
            //from dbid to node, to fragid


            let it = _self.viewer.model.getData().instanceTree;
            it.enumNodeFragments(
              dbid,
              function(fragId) {
                var renderProxy = _self.viewer.impl.getRenderProxy(
                  _self.viewer.model,
                  fragId
                );
                renderProxy[dbid] = new THREE.Mesh(
                  renderProxy.geometry,
                  material
                );

                renderProxy[dbid].matrix.copy(renderProxy.matrixWorld);
                renderProxy[dbid].matrixWorldNeedsUpdate = true;
                renderProxy[dbid].matrixAutoUpdate = false;
                renderProxy[dbid].frustumCulled = false;

                _self.viewer.impl.addOverlay(dbid, renderProxy[dbid]);
                _self.viewer.impl.invalidate(true);
              },
              false
            );
          }
        }
      }

    },
    cutHex(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    },
    addMaterial(color, id) {
      let _self = this;
      this.materials[id] = new THREE.MeshPhongMaterial({
        color: color
      });
      //viewer.impl.matman().addMaterial(newGuid(), material);

      this.viewer.impl.createOverlayScene(
        id,
        _self.materials[id],
        _self.materials[id]
      );
      return _self.materials[id];
    },
    createRestoreColor() {
      let _self = this;
    this.viewer.restoreColorMaterial = function(
      objectIds
    ) {
      for (var i = 0; i < objectIds.length; i++) {
        var dbid = objectIds[i];

        //from dbid to node, to fragid
        var it = _self.viewer.model.getData().instanceTree;

        if (_self.materials[dbid]) delete _self.materials[dbid];

        it.enumNodeFragments(
          dbid,
          function(fragId) {
            var renderProxy = _self.viewer.impl.getRenderProxy(
              _self.viewer.model,
              fragId
            );

            if (renderProxy[dbid]) {
              //remove all overlays with same name
              _self.viewer.impl.clearOverlay(dbid);
              //_self.viewer.impl.removeOverlay(id, renderProxy[id]);
              delete renderProxy[dbid];

              //refresh the sence
              _self.viewer.impl.invalidate(true);
            }
          },
          true
        );
      }
      }

    },
    selectObjects(id) {
      dataService.getBimObjects(id).then(res => {
        this.viewer.select(res);
      });
    },
    zoomObjects(id) {
      let selection = this.viewer.getSelection();
      
      setTimeout(() => {
        this.viewer.fitToView(selection);
      }, 1)
      this.viewer.fitToView([selection]);
      
    },
    displayTicketsColor(items) {
      let self = this;
      let realNode;
      this.ticketToZoom = [];
      this.colors = {}
      let iterator = 0;
            for (var node in items) {
              //realNode = SpinalGraphService.getRealNode(items[node].info.id.get());
              realNode = graph.SpinalGraphService.getRealNode(items[node].id.get());
              self.colors[iterator] = items[node].color.get();

               realNode.find( [
                 'SpinalSystemServiceTicketHasLocation',
                 "hasBIMObject",
                 'hasReferenceObject'
               ],
               self.predicat
               )
               .then( lst => {
                 let result = lst.map( function(x) { return (x.info.dbid.get()) });
                 self.ticketToZoom.push(result);
               } );
               iterator++


            }


      setTimeout(function() {
        self.setColorMaterial()
      }, 500);
       window.addEventListener("click", this.eventForColor, true);
    },
    predicat: function( node ) {
      return node.info.type.get() === "BIMObject";
    },
    eventForColor: function(event) {
      for (var i in this.ticketToZoom) {
        this.viewer.restoreColorMaterial(this.ticketToZoom[i])
      }
      window.removeEventListener("click", this.eventForColor, true);
      event.preventDefault();
    },
    setColorMaterial: function() {
      let self = this;
      var iterator = 0;
      let color;
      let loop = 0;
      console.log("good ------------", this.viewer);
      var x = setInterval(function() {
        color = self.colors[iterator].replace(/#/g, "0x");
        self.viewer.setColorMaterial(self.ticketToZoom[iterator], color)
        iterator++;
        if (self.ticketToZoom[iterator] === undefined && loop === 0) {
          iterator = 0;
          loop = 1;
        } else if (self.ticketToZoom[iterator] === undefined && loop === 1) {
          clearInterval(x);
        }
      }, 100);
    },
    isolateObjects(id) {
      dataService
        .getBimObjects(id)
        .then(res => {
          this.viewer.isolate(res);
          this.viewer.fitToView(res);
          return;
        })
        // .then(() => {
        //   setTimeout(() => {
        //     this.viewer.setViewCube("[front,]");
        //   }, 1000);
        // });
    },

    setCameraToTopView() {}
  }
};
</script>

<style scoped>
/* .mainLayout {
  width: calc(100% - 50px);
  position: relative;
  -webkit-transition-duration: 0.3s;

  margin-left: 50px;
}

.mainLayout.collapsed {
  width: calc(100% - 350px);
  margin-left: 350px;
}
*/
.viewerContainer {
  width: 51%;
  height: calc(96%);
  position: relative;
  float: left;
  padding-left: 160px;
}

</style>
