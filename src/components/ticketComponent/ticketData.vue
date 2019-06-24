<template class="renderDataTicket">
	<div v-if="active">
		<process-component :processList="allData.process">
			
		</process-component>
	</div>
	<div v-else>
		<ticket-table :allTickets="selectedTicket"
					  :steps="steps"
					  :selectedSteps="selectedSteps"
					  :title="selectProcess">
		</ticket-table>
	</div>
</template>

<script>
import { EventBus } from "../../config/event";
import graph from "../../config/GraphService";
import processComponent from "./processComponent.vue";
import ticketTable from "./ticketTable.vue";

export default {
	name: "ticketData",
	data() {
    return {
      active: true,
      levelSelected: "",
      process: [],
      steps: [],
      allTickets: [],
      selectedTicket: [],
      selectedSteps: [],
      init: true,
      selectProcess: ""
    };
  },
  components: {
  	processComponent,
  	ticketTable
  },
  props: ["allData"],
  mounted() {
	let self = this;
	this.getEvents();
	setTimeout(function() {
		self.getAllTickets().then(self.extractProcess());
	}, 1000)
  },
  methods: {
    getEvents() {
      let self = this;
      EventBus.$on("click-event", item => self.levelSelected = item.name );
      EventBus.$on("select-process", process => {
      		self.active = false;
      		self.selectProcess = process;
      		self.triTicket();
     });
     EventBus.$on("getBackToProcess", () => self.active = true );
     EventBus.$on("select-steps", selected =>  { 
     	self.selectedSteps = selected;
     	self.init = false;
     	self.triTicket();
     });
     EventBus.$on("reset-select", () => {
     	self.levelSelected = "";
     	self.triTicket();
     })
	},
	extractProcess() {
		for (var ticket in this.selectedTicket) {
			if (this.steps.indexOf(this.selectedTicket[ticket]['stepName']) == -1 && this.selectedTicket[ticket]['stepName'] !== undefined)
				this.steps.push(this.selectedTicket[ticket]['stepName']);
		}
		this.selectedSteps = this.steps;
	},
	triTicket() {
		this.selectedTicket = []
		if (this.levelSelected === "") {
			for (var ticket in this.allTickets)
				for (var el in this.allTickets[ticket])
					if (this.allTickets[ticket][el]['processName'] === this.selectProcess) {
						if (this.selectedSteps.indexOf(this.allTickets[ticket][el]['stepName']) !== -1 || this.init === true )
							this.selectedTicket.push(this.allTickets[ticket][el]);
					}
		}
		else
			for (var level in this.allTickets)
				if (level === this.levelSelected)
					for (var ticket in this.allTickets[level])
						if (this.allTickets[level][ticket]['processName'] === this.selectProcess)
							if (this.selectedSteps.indexOf(this.allTickets[level][ticket]['stepName']) !== -1 || this.init === true )
								this.selectedTicket.push(this.allTickets[level][ticket]);
		this.extractProcess();
		console.log("------->", this.selectedTicket)
	},
	addStep(node, processName) {
		let self = this;
		graph.SpinalGraphService.getChildren(node.processId.get()).then(processNode =>  {
		let array = [];
			for (var i in processNode) {
				if (processNode[i].type.get() === "SpinalSystemServiceTicketTypeStep") {
					if (self.process.indexOf(processName === -1)) {
						self.process[processName] = [];
					}
					if (self.process[processName].indexOf(processNode[i].name.get() === -1)) {
						array.push(processNode[i].name.get());
						self.process[processName].push(array);
					}
					if (node.stepId.get() == processNode[i].id.get()) {
						node['stepName'] = processNode[i].name.get();
					}
				}
			}

		});
	},
	getAllTickets() {
		let self =  this;
		let tmp;
		return new Promise((resolve) => {
		//self.allTickets = [];
		//self.process = [];

			for (var floorLvl in self.allData.rooms)
				for (var allRooms in self.allData.rooms[floorLvl].rooms) {
					if (self.allData.rooms[floorLvl].rooms[allRooms].tickets != undefined) {
						if (self.allTickets[self.allData.rooms[floorLvl].floor] == undefined) {
							self.allTickets[self.allData.rooms[floorLvl].floor] = [];
							self.allData.rooms[floorLvl].rooms[allRooms].tickets.forEach(el => {
								tmp = graph.SpinalGraphService.getRealNode(el.processId.get());
								el['processName'] = tmp.info.name.get();
								self.addStep(el, tmp.info.name.get());
								self.allTickets[self.allData.rooms[floorLvl].floor].push(el);
							})
						}
						else
							self.allData.rooms[floorLvl].rooms[allRooms].tickets.forEach(el => {
								tmp = graph.SpinalGraphService.getRealNode(el.processId.get());
								if (tmp !== undefined) {
								el['processName'] = tmp.info.name.get();
								self.addStep(el, tmp.info.name.get());
								self.allTickets[self.allData.rooms[floorLvl].floor].push(el);
								}
							});
					}
					if (floorLvl == (self.allData.rooms.length - 1) && allRooms == (self.allData.rooms[floorLvl].rooms.length - 1) )
						resolve(true);
				}
		});
	}
  },
  watch: {
  	levelSelected() {
  		console.log("levelSelected updated", this.levelSelected);
  		this.triTicket();
  		this.extractProcess();
  	},
  	allData() {
  		console.log("watch alldata", this.allData);
  		this.allTickets = [];
		this.process = [];
  		this.getAllTickets().then(() => {
  			this.extractProcess();
  			this.triTicket();
  		});
  	},
  	process() {
  		console.log("update proces", this,process);
  	}
  }
};
</script>

<style>
.renderDataTicket {
  margin-left: 57%;
  background-color: rgba(1,2,1,0);
  height: 93%;
  width: 43%;
}

</style>