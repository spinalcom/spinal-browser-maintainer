<template>
<div>
	<button class="backButton" @click="backToProcess"><v-icon color="white">arrow_back</v-icon></button>
	<icon id="title">{{title}}</icon>
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
       	<td @mouseover="overTableRow(props)" @mouseleave="mouseLeave()" @click="onClick(props)" :style="isOver(props.item)">{{ props.item.name.get() }}</td>
      	<td @mouseover="overTableRow(props)" @mouseleave="mouseLeave()" @click="onClick(props)" :style="isOver(props.item)" class="text-xs-right">{{ ticketDate(props.item.creationDate.get()) }}</td>
      	<td class="text-xs-right" @click="onClick(props)" :style="isOver(props.item)" @mouseover="overTableRow(props)" @mouseleave="mouseLeave()">
      		<p class="colorPatchDisplay displayInline" :style="{backgroundColor: props.item.color.get()}" ></p> {{ props.item.stepName }}</td>
       	<td><v-icon @click="selectDetails(props)">details</v-icon></td>
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
          { text: 'Step', value: 'step', align: 'center'},
          { text:"Details",
      		align: 'right'}
          ],
		pagination: {
			descending: true,
			page: 1,
			rowsPerPage: 16,
			sortBy: 'creationDate',
			totalItems: 0,
			rowsPerPageItems: [17]
		},
		clicked: false
      }
    },
    props: ["allTickets", "steps", "selectedSteps", "title"],
    mounted() {
		//console.log("table has mounted", this.allTickets.forEach(function(el) { console.log(el.name.get())}), this.allTickets);
    },
    methods: {
		backToProcess() {
			EventBus.$emit("getBackToProcess", true)
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
		isOver(item) {
			if (item.over === true)
				return 'background-color:grey';
		},
		hexToRgb(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		},
		getContrastYIQ(hexcolor) {
			const rgb = this.hexToRgb(hexcolor);
			var yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
			return (yiq >= 128) ? 'black' : 'white';
		},
		getstyle(step) {
		return {
			"background-color": step.color.get(),
			color: this.getContrastYIQ(step.color.get())
			};
		},
		mouseLeave() {
			EventBus.$emit("mouse-leave");
		},
		selectDetails(item) {
			console.log(item);
			EventBus.$emit("ticket-details", item.item);
		},
		onClick(item) {
			//if (this.clicked === false) {
				let ticket = {}
				ticket.id = item.item.bimId.get();
				EventBus.$emit("click-ticket-event", ticket);
			//} else
			//console.log("already")
		},
		showTicketsColor() {
			console.log("display color", this.allTickets);
			EventBus.$emit("display-colors", this.allTickets);
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

.displayInline {
	display: inline;
	padding-left: 20px;
}
.colorPatchDisplay {
	border-color: black;
	border-style: solid;
}

#selectEyeForTickets {
	float: right;
	margin-top: 7px;
	border-radius: 50%;
	border: solid;
	padding: 3px;
}
#title {
	margin-left: 28%;
}
.customColor {
	color: var(--accent-color);
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
    padding-top: 4px;
    width: 90px;
    padding-bottom: 8px;
}

.layout {
	float: right !important;
	font-family: sans-serif !important;
}
</style>