<!--
Copyright 2018 SpinalCom - www.spinalcom.com
This file is part of SpinalCore.
Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.
This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.
If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div id="myCustomTicketPanel">

  <div v-if="selected==0">

  <div id="selectStepDiv">
  <p v-if="patchBug" style="position:absolute; margin-top:23px;" id="patchMdSelectBugDefaultValue"></p>
  <md-field>
   <md-select id="selectStepDivId" v-model="thisProcess" @md-selected="searchProcess">
    <md-option v-for="ticket in tickets" :value="ticket" class="optionForSelect">
      {{ ticket }}
    </md-option>
  </md-select>
  </md-field>
    <md-icon class="ButtonShowAllTicket md-size-1x" title="show all ticket's place" v-on:click.native="zoomAllTickets">remove_red_eye</md-icon>
  </div>

  <div class="stepbox" v-for="step in stepsList">
      <div class="badgeForStep"></div>
      <md-button class="ticketButton" :title="step" type="button" v-on:click="selectSteps">{{ step }} </md-button>
      <div class="selectedstepbox"></div>
  </div>

  <div class="divDisplayTickets">
    <div class="divTicketsWithButton" v-for="ticket in ticketsList">
        <p class="stepbox" v-on:click="modifyTicket"> {{ ticket }} </p>
        <md-icon class="ButtonChangeTicket" v-model="stepper" v-on:click.native="modifyTicket">edit</md-icon>
        <md-icon class="ButtonChangeTicket md-size-1x" title="find room" v-on:click.native="zoomRoom">remove_red_eye</md-icon>
    </div>
  </div>

  </div>

  <md-button v-if="selected==1" class="md-raised unique-button-for-close-diag" style="margin-left:10px; margin-top:19px" v-on:click="selected=0">Retour</md-button>
  <updateticket v-if="selected==1"
                :updateticketObj="updateticketObj"
                :listOfSteps="stepsList"
                :currentProcess="selectedProcess"
                :stepNode="listOfStepsForProcess"
                :stepFrom="steps"></updateticket>
</div>
</template>

<script>
import { SpinalServiceTicket } from 'spinal-service-ticket';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import updateticket from './UpdateTicket.vue';
import {
  SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME
} from "spinal-service-ticket/dist/Constants";

import {
  spinalPanelManagerService,
} from "spinal-env-viewer-panel-manager-service";

export default {
  name: "PanelTicket",
  components: {
      updateticket
    },
  data() {
    return {
      stepper: 1,
      selectedProcess: "",
      updateticketObj: {},
      processId: "",
      tickets: [],
      thisProcess: {},
      stepsList: [],
      underline: '',
      ticketNode: [],
      steps: '',
      ticketsList: [],
      ticketToZoom: [],
      patchBug: 1,
      binding: false,
      nodeBinded: {},
      contextBind: {},
      ticketContext: {},
      selected: 0
    };
  },
  methods: {
    opened: function() {
      let self = this;
      this.viewer = window.spinal.ForgeViewer.viewer;
      this.tickets = [];
      this.arrayOfSelect = [];

      let contextTicket = SpinalGraphService.getContext("Ticket Service");
      this.ticketContext = contextTicket;
      this.contextBind = contextTicket.bind(() => self.updateProcessList.call());
      SpinalGraphService.getChildren(contextTicket.info.id.get())
      .then(k => k.forEach(function(el){
        self.tickets.push(el.name.get());
        self.thisProcess = self.tickets[0];

        if (self.listOfStepsForProcess === undefined) {
          let p = window.document.getElementById("patchMdSelectBugDefaultValue");
          p.innerHTML = self.thisProcess;
        }
      })

      );
        this.selectProcess(this.thisProcess, true);
    },
    closed: function() {
      this.underline.remove();
      this.ticketNode = [];
      this.listOfStepsForProcess = undefined;
      this.ticketContext.unbind(self.contextBind);
    },
    hasChildInContext: function (id, contextId) {
      return SpinalGraphService.hasChildInContext(id, contextId);
    },
    updateProcessList: function () {
      let self = this;

      SpinalGraphService.getChildren(SpinalGraphService.getContext("Ticket Service").info.id.get())
        .then(k => {
        let tmp = self.tickets.slice(0);
        k.forEach(function(el){

          if (self.tickets.indexOf(el.name.get()) == -1)
            self.tickets.push(el.name.get());
          else
            tmp.splice(tmp.indexOf(el.name.get()), 1);
          })
        if (self.thisProcess === tmp[0])
        {
          self.thisProcess = self.tickets[0];
          self.underline.remove();
        //  self.selectProcess(self.thisProcess, true);
        }
        if (self.tickets.indexOf(tmp[0]) !== -1)
          self.tickets.splice(self.tickets.indexOf(tmp[0]), 1);
        }
      );
    },
      searchProcess: function () {
      this.selectProcess();
    },
    zoomRoom: function(event) {
      let str = event.target.parentElement.firstElementChild.innerText;

      for (var i in this.ticketNode) {
        if (this.ticketNode[i].name.get() === str) {
          let realNode = SpinalGraphService.getRealNode(this.ticketNode[i].id.get());

          let self = this;
          realNode.find( [
           "SpinalSystemServiceTicketHasLocation",
            "hasBIMObject",
            'hasReferenceObject'
          ],
          self.predicat
          )
          .then( lst => {
            self.viewer.clearSelection();
            let result = lst.map( x => x.info.dbid.get() );
            self.viewer.select( result );
          } );
        }
      }
    },
    updateBadge: function() {
      SpinalServiceTicket.getStepsFromProcessAsync(this.processId)
          .then((k) => {
            for (var i in k) {
                (function(k, i) {
                  setTimeout(function() {
                  SpinalGraphService.getChildren(k[i].id.get()).then((tickets) => {
                    let badges = document.getElementsByClassName("badgeForStep");
                    badges[i].style.backgroundColor = k[i].color.get();
                    badges[i].innerText = tickets.length;
                });
                }, 30 * i)
              })(k, i)
            }
          });
    },
    predicat: function( node ) {
      return node.info.type.get() === "BIMObject";
    },
    modifyTicket: function(event) {
      let nodeValue = event.target.previousSibling.previousElementSibling.innerText;

      for (var i in this.ticketNode) {
        if (this.ticketNode[i].name.get() === nodeValue) {
          this.updateticketObj = this.ticketNode[i];
        }
      }

      this.selected = 1;
    },
    zoomAllTickets: function(event) {
      let self = this;
      let realNode;
      this.ticketToZoom = [];
      this.colors = {}
      let iterator = 0;
      for (var index in self.listOfStepsForProcess) {
          self.listOfStepsForProcess[ Object.keys(self.listOfStepsForProcess)[
          (Object.keys(self.listOfStepsForProcess).length - 1 ) - Object.keys(self.listOfStepsForProcess).indexOf(index)]]
          .getChildren().then((tickets) => {
            for (var node in tickets) {
              realNode = SpinalGraphService.getRealNode(tickets[node].info.id.get());
              self.colors[iterator] = realNode.info.color.get();
              realNode.find( [
                SPINAL_TICKET_SERVICE_TARGET_RELATION_NAME,
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
        });
      }

      setTimeout(function() {
        self.setColorMaterial()
      }, 500);
       window.addEventListener("click", this.eventForColor, true);

    },
    eventForColor: function(event) {
      for (var i in this.ticketToZoom) {
        window.spinal.ForgeViewer.viewer.restoreColorMaterial(this.ticketToZoom[i])
      }
      window.removeEventListener("click", this.eventForColor, true);
      event.preventDefault();
    },
    selectSteps: function(event) {
      let str = event.target.innerText;
      this.ticketNode = [];
      this.ticketsList = [];
      let self = this;

      if (typeof this.underline.remove === "function")
        this.underline.remove();
      let el = document.getElementsByClassName("selectedstepbox");
      var newDiv = document.createElement("div");
      newDiv.style.width = "88px";
      newDiv.style.height = "2px";
      newDiv.style.marginLeft = "15px";
      newDiv.style.backgroundColor = "white";
      newDiv.classList.add("underlineForStep");
      this.underline = newDiv;
      SpinalGraphService.getChildren(self.selectedProcess.info.id.get()).then((childrens) => {
        for ( var i in childrens ) {
          if ( childrens[i].name.get().toUpperCase() === str.toUpperCase() ) {
            self.steps = str;

            let parentDiv = el[i].parentNode;
            parentDiv.insertBefore(newDiv, el[i]);
            SpinalGraphService.getChildren(childrens[i].id.get()).then((tickets) => {
              for ( var node in tickets ) {
                self.ticketNode.push(tickets[node]);
                self.ticketsList.push(tickets[node].name.get());
              }
            });
          }
        }
      })
    },
    setColorMaterial: function() {
      let self = this;
      var iterator = 0;
      let color;
      let loop = 0;
      var x = setInterval(function() {
        color = self.colors[iterator].replace(/#/g, "0x");
        window.spinal.ForgeViewer.viewer.setColorMaterial(self.ticketToZoom[iterator], color)
        iterator++;

        if (self.ticketToZoom[iterator] === undefined && loop === 0) {
          iterator = 0;
          loop = 1;
        } else if (self.ticketToZoom[iterator] === undefined && loop === 1) {
          clearInterval(x);
        }
      }, 100);

    },
    clearUnderline: function() {
      let el = document.getElementsByClassName('underlineForStep');
      for (var i in el)
      {
        if (typeof parseInt(i) === 'number' && (parseInt(i) + 1) !== el.length)
          if (typeof el[i].remove === 'function')
            el[i].remove();
      }
    },
    selectProcess: function(value, bool) {
      let processName;
      let iterator_value;
      let goodStep = "Déclaré";
      let self = this;

      if (this.binding == true && bool == false) {
        this.binding = false;
        return 0;
      } else if (bool == false) {
        value = this.thisProcess;
      }

      if (value == undefined)
         return 0;

      if (this.steps !== "")
        goodStep = this.steps

      this.stepsList = [];
      this.ticketsList = [];
      this.ticketNode = [];

      if (this.listOfStepsForProcess !== undefined && this.thisProcess === value)
        this.patchBug = 0;

      SpinalServiceTicket.getAllProcessAsync().then((process) => {
      let ite = 0;
      let iterator1 = process.values();
      while ( ite < process.size ) {
        iterator_value = iterator1.next().value;
        processName = SpinalGraphService.getRealNode(iterator_value);
        if (processName.info.name.get() === value) {

          if (self.selectedProcess !== "")
            self.selectedProcess.unbind(self.nodeBinded);

          self.selectedProcess = processName;
          self.processId = iterator_value;

          self.nodeBinded = processName.bind(() => self.selectProcess.call(self, self.processName, false));
          self.binding = true;
          SpinalServiceTicket.getStepsFromProcessAsync(iterator_value)
          .then((k) => {
             let stepsName = [];
             let name;
             let stepNode;
             self.listOfStepsForProcess = {};
             for (var i in k) {
                stepNode = SpinalGraphService.getRealNode(k[i].id.get());
                name = stepNode.info.name.get();
                stepsName.push(name);
                self.listOfStepsForProcess[name] = stepNode;
                if (name.toUpperCase() === goodStep.toUpperCase()) {
                  let el = document.getElementsByClassName("selectedstepbox");
                  var newDiv = document.createElement("div");
                  newDiv.style.width = "88px";
                  newDiv.style.height = "2px";
                  newDiv.style.marginLeft = "15px";
                  newDiv.style.backgroundColor = "white";
                  newDiv.classList.add("underlineForStep");
                  self.underline = newDiv;
                  let ite = i;
                  setTimeout(function() {
                    let parentDiv = el[ite].parentNode;
                    parentDiv.insertBefore(newDiv, el[ite]);
                    self.updateBadge();
                    self.clearUnderline();
                  }, 100)
                  self.steps = name;
                  let realnode = SpinalGraphService.getRealNode(k[i].id.get());
                  realnode.getChildren().then((tickets) => {
                       for (var node in tickets) {
                          self.ticketNode.push(tickets[node].info);
                          self.ticketsList.push(tickets[node].info.name.get());
                        }
                  });
                }
             }
             self.stepsList = stepsName;
          })
          break;
        }
        ite++;
      }
      });
    }
  },
  watch: {
    thisProcess: {
      handler: function(value) {
      this.selectProcess(value, true);
    },
    immediate: true,
    },
    selected: function() {
      if (this.selected == 0)
        this.selectProcess(this.thisProcess);
    }
  },
};

</script>

<style>

#myCustomTicketPanel * {
  box-sizing: border-box !important;
  justify-content: flex-start !important;
}

.graph-viewer-ticket * {
  margin: 0;
  box-sizing: border-box;
}

.stepbox {
  display: inline-block;
}

#selectStepDiv {
  display: block;
  margin-left: 10px;
  margin-top: 10px;
}

.divDisplayTickets {
  display: block;
}

.ticketButton {
  margin-left: 20px;
}

.divTicketsWithButton {
  height: 35px;
  margin-left: 10px;
}

.divTicketsWithButton:hover {
  background-color: #262728;
}

.ButtonChangeTicket {
  display: inline-block;
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}

.ButtonShowAllTicket {
  display: inline-block;
  margin-top: 11px;
  float: right;
  margin-right: 20px;
}

.badgeForStep {
  height: 24px;
  color: black;
  width: 24px;
  border-radius: 100%;
  text-align: center;
  position: absolute;
  margin-top: 13px;
}

</style>
