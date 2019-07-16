<template>
<div>
	<button class="backButton" @click="backToProcess"><v-icon color="white">arrow_back</v-icon></button>
	<div id="displayDetails">
<!-- 		<p>name : {{ ticket.name.get() }}</p>
		<p>categorie: {{ ticket.categories.get() }}</p>
		<p>process: {{ ticket.processName }}</p>
		<p class="displayInline">step: {{ ticket.stepName }}</p><p class="colorPatchDisplay displayInline" :style="{backgroundColor: ticket.color.get()}" ></p>
		<p>username: {{ ticket.username.get() }}</p>
		<p>creation date: {{ timeConverter(ticket.creationDate.get()) }}</p> -->
		<div class="applicationDetailsDisplay">
			<v-icon class="applicationFloatDisplay">remove_red_eye</v-icon> 
		</div>
		<div class="processDisplayColor" :style="{backgroundColor:ticket.color.get()}">
		</div>
		<div class="informationTicketDisplay">
			<div class="lineDisplayInfo"> name: {{ ticket.name.get() }}</div>
			<div class="lineDisplayInfo"> Etat: {{ ticket.stepName }}</div>
			<div class="lineDisplayInfo"> Date : {{ timeConverter(ticket.creationDate.get()) }}</div>
			<div class="lineDisplayInfo">Auteur : {{ ticket.username.get() }} </div>
		</div>
		<v-textarea label="description" id="textDetails"> {{ ticket.note.get() }} </v-textarea>
		<div class="displayLogForTicket" >
			log
			<div v-for="x in 1">
				<div class="elementToDisplayDetails"> creation : {{ timeConverter(ticket.creationDate.get()) }} </div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
	name: "ticketDetails",
	data () {
      return { }
    },
    props: ["ticket"],
    mounted() {
    	console.log(this.ticket);
    },
    methods: {
    	backToProcess() {
    		EventBus.$emit("close-details");
    		console.log("b");
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
		}
    }
};
</script>

<style>
.displayInline {
	display: inline-flex;
}
/*#displayDetails {
	text-align: center;
	margin-top: calc(40%);
}*/
#displayDetails {
	padding-top: 50px;
}
.colorPatchDisplay {
	width: 100px;
	padding-top : 14px;
	margin-left: 10px;
	border-style: solid;
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

.applicationDetailsDisplay {
	border: 1px solid;
	height: 25px;
}
.applicationFloatDisplay {
	float: right;
}

.processDisplayColor {
	margin-top: 10px;
	border: 1px solid;
	height: 100px;
	width:  18%;
	display: inline-block;

}
.informationTicketDisplay {
	border: 1px solid;
	height: 100px;
	padding-left: 5px;
	width: 80%;
	float: right;
    margin-top: 11px;
}
.lineDisplayInfo {
	margin-top: 6px;
}

#textDetails {
	border: 1px solid;
	height: 60px;
}

.displayLogForTicket {

}

.elementToDisplayDetails {
border: 0.1px solid;
}
</style>