<template>
<div>
	<button class="backButton" @click="backToProcess">< Back</button>
	<icon>title</icon>
	<filter-dialog :steps="steps" 
				   :selectedSteps="selectedSteps" ></filter-dialog>
	<button id="selectEyeForTickets" @click="showTicketsColor"><v-icon>remove_red_eye</v-icon></button>
  <v-data-table
    :headers="headers"
    :items="allTickets"
    :pagination.sync="pagination"
    :rows-per-page-items="pagination.rowsPerPageItems"
    :total-items="pagination.totalItems"
    class="elevation-1 
    	   ticketTableDisplay"
  >
    <template v-slot:no-data>
      <v-alert :value="true" color="error" icon="warning">
        Sorry, nothing to display
      </v-alert>
    </template>

    <template slot="headerCell" slot-scope="props">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            {{ props.header.text }}
          </span>
        </template>
        <span>
          {{ props.header.text }}
        </span>
      </v-tooltip>
    </template>
    <template v-slot:items="props">
       	<td @mouseover="overTableRow(props)" @mouseleave="mouseLeave()">{{ props.item.name.get() }}</td>
      	<td @mouseover="overTableRow(props)" @mouseleave="mouseLeave()" class="text-xs-right">{{ ticketDate(props.item.creationDate.get()) }}</td>
      	<td class="text-xs-right" @mouseover="overTableRow(props)" @mouseleave="mouseLeave()">{{ props.item.processName }}</td>
    </template>

  </v-data-table>
</div>
</template>

<script>
import { EventBus } from "../../config/event";
import filterDialog from "./filterDialog.vue";
import graph from "../../config/GraphService";

export default {
	name: "ticketTable",
	components: {
		filterDialog
	},
	data () {
      return {
        headers: [
          {
            text: 'Ticket Name',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Creation Date', value: 'creation date', align: 'center' },
          { text: 'Steps', value: 'steps', align: 'center'}
          ],
		pagination: {
			descending: true,
			page: 1,
			rowsPerPage: 16,
			sortBy: 'creationDate',
			totalItems: 0,
			rowsPerPageItems: [17]
		}
      }
    },
    props: ["allTickets", "steps", "selectedSteps"],
    mounted() {
		//console.log("table has mounted", this.allTickets.forEach(function(el) { console.log(el.name.get())}), this.allTickets);
    },
    methods: {
		backToProcess() {
			EventBus.$emit("getBackToProcess")
		},
		predicat: function( node ) {
			return node.info.type.get() === "BIMObject";
		},
		overTableRow(el) {
			let self = this;
			graph.SpinalGraphService.findNodes(el.item.id, [
				"SpinalSystemServiceTicketHasLocation",
				"hasBIMObject",
				'hasReferenceObject'
			],
			self.predicat
			).then( lst => {
				EventBus.$emit("select-tickets-room", lst);
			} );
		},
		mouseLeave() {
			EventBus.$emit("mouse-leave");
		},
		showTicketsColor() {
			console.log("display color", this.allTickets);
		},
		timeConverter(UNIX_timestamp){
			var a = new Date(UNIX_timestamp);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
			return time;
		},
		ticketDate(value) {
			return this.timeConverter(value);
		}
    }
    };
</script>
<style scoped>
#selectEyeForTickets {
	float: right;
	margin-top: 7px;
	border: solid;
	padding: 3px;
}

.v-alert {
	color: black;
}
.backButton {
	background-color: black;
    color: white;
    padding: 9px;
    margin-top: 5px;
    margin-left: 8px;
    font-size: 17px;
    font-family: sans-serif;
}

.layout {
	float: right !important;
	font-family: sans-serif !important;
}
</style>