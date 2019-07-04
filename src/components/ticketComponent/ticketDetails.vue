<template>
<div>
	<button class="backButton" @click="backToProcess"><v-icon color="white">arrow_back</v-icon></button>
	<div id="displayDetails">
		<p>name : {{ ticket.name.get() }}</p>
		<p>categorie: {{ ticket.categories.get() }}</p>
		<p>process: {{ ticket.processName }}</p>
		<p class="displayInline">step: {{ ticket.stepName }}</p><p class="colorPatchDisplay displayInline" :style="{backgroundColor: ticket.color.get()}" ></p>
		<p>username: {{ ticket.username.get() }}</p>
		<p>creation date: {{ timeConverter(ticket.creationDate.get()) }}</p>
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
#displayDetails {
	text-align: center;
	margin-top: calc(40%);
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
</style>