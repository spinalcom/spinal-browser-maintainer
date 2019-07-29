<template>
	<div>
	<div>
		<button class="backButton" @click="backToProcess"><v-icon color="white">arrow_back</v-icon></button>
	</div>

	<div class="calendar">
	 <v-layout wrap>
    <v-flex
      xs12
      class="mb-3"
    >
      <v-sheet height="500" @click="onClick">
        <v-calendar
          ref="calendar"
          v-model="start"
          :type="type"
          color="primary"
        >
        	<template v-slot:day="{present, past, date}">
        		{{ date }}
        	</template>
        </v-calendar>
      </v-sheet>
    </v-flex>

    <v-flex
      sm4
      xs12
      class="text-sm-left text-xs-center"
    >
      <v-btn @click="$refs.calendar.prev()">
        <v-icon
          dark
          left
        >
          keyboard_arrow_left
        </v-icon>
        Prev
      </v-btn>
    </v-flex>
    <v-flex
      sm4
      xs12
      class="text-xs-center"
    >
      <v-select
        v-model="type"
        :items="typeOptions"
        label="Type"
      ></v-select>
    </v-flex>
    <v-flex
      sm4
      xs12
      class="text-sm-right text-xs-center"
    >
      <v-btn @click="$refs.calendar.next()">
        Next
        <v-icon
          right
          dark
        >
          keyboard_arrow_right
        </v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
  </div>
</div>
</template>

<script>
import { EventBus } from "../../config/event";
import dateService from "../../config/dateService";

export default {
	name: "ticketCalendar",
	props: ["selectedTicket"],
	data: () => ({
    type: 'month',
    start: '',
    end: '2019-01-06',
    typeOptions: [
      { text: 'Day', value: 'day' },
      { text: '4 Day', value: '4day' },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' },
      { text: 'Custom Daily', value: 'custom-daily' },
      { text: 'Custom Weekly', value: 'custom-weekly' }
    ]
  }),
	methods: {
		backToProcess() {
			EventBus.$emit("getBackToProcess", true)
		},
		onClick(item) {
			console.log("onclickw", item)
		},
		initService(date) {
		}
	},
	mounted() {
		var d = new Date();
		this.start = d.toDateString();
		dateService.init(this.selectedTicket);
		console.log("selectedTicket", this.selectedTicket);
	}
};
</script>

<style>
.backButton {
	box-sizing: border-box !important;
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
.calendar {
	margin: 15px;
}
</style>