<template>
	<div class="overflowDisplayProcess">
		<p class="displayProcessElementTitle">Choose a process</p>

		<div v-for="element in processList" class="displayButtonChooseProcess">
			<button class="buttonProcessDisplay" @click="selectProcess"> 
<!-- 				<v-badge right color="red">
      <template v-slot:badge>
        <span class="processBadge">6</span>
      </template> -->
				{{ element }}
				<p class="displayCountBadge" v-if="displayBadge(element) !== ' '">{{ displayBadge(element) }}</p>
<!-- 			</v-badge>
 -->			</button>

		</div>
	</div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
	name: "processComponent",
	data() {
		return {
			BadgeValue: {}
		}
	},
	props: ["processList", "allData", "backFrom"],
	methods: {
		selectProcess(target) {
			let txt = target.target.innerHTML.split(/</g)[0].split('\n').join('');
			txt = txt.split('\t').join('');
			EventBus.$emit("select-process", txt);
		},
		calculateTotal(bool, item) {
			console.log("calcul", this.backFrom, this.allData.rooms);

			if (this.backFrom !== '') {
				let rooms = this.allData.rooms;
					for (var room in rooms)
						if (rooms[room].floor === this.backFrom)
							this.BadgeValue = rooms[room].processNumber;
						return;
			}

			if (bool) {
				let rooms = this.allData.rooms;
					for (var room in rooms)
						if (rooms[room].floor === item.name)
							this.BadgeValue = rooms[room].processNumber;
			} else {
				console.log("123454321", this.allData.totalTickets.count);
				this.BadgeValue = this.allData.totalTickets.count;
			}
		},
		displayBadge(value) {
			if (this.BadgeValue === undefined) {
				return ' ';
			}
			if (this.BadgeValue[value] === undefined)
				return ' ';
			else
				return this.BadgeValue[value];
		},
		getEvent() {
			EventBus.$on("reset-select", () => this.calculateTotal(false));
			EventBus.$on("click-room", (item) => this.calculateTotal(true, item));
		}
	},
	watch: {
		BadgeValue() {
			console.log("update badge value");
		},
		backFrom() {
			this.calculateTotal(false, this.backFrom);
		}
	},
	mounted() {
		this.getEvent();
		console.log('---------_>', this.BadgeValue);
		this.calculateTotal(false)
	}
};
</script>
<style scoped>
.displayCountBadge {
	display: inline-grid;
	background-color: red;
	border-radius: 50%;
	height: 20px;
	width: 20px;
	margin-bottom: 0px;
	padding-top: 2px;
}
.displayProcessElementTitle {
	margin-left: 48%;
}
.overflowDisplayProcess {
	overflow: auto;
}
.processBadge {
	margin-left: 0px;
}
.displayButtonChooseProcess {
	margin-left: 44%;
}
.buttonProcessDisplay {
	background-color:grey;
	color: white;
	margin-left:0%;
	width: 52%;
	padding: 2%;
	margin-top: 2%;
	cursor: pointer;
}
@media screen and (max-width: 983px) {
 .overflowDisplayProcess {
    overflow: initial !important;
 }
}
</style>