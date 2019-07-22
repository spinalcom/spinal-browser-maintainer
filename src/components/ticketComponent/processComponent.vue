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
			BadgeValue: {},
			actualizeBadge: true
		}
	},
	props: ["processList", "allData", "backFrom"],
	methods: {
		selectProcess(target) {
			if (target.target.className !== "displayCountBadge") {
				let txt = target.target.innerHTML.split(/</g)[0].split('\n').join('');
				txt = txt.split('\t').join('');
				EventBus.$emit("select-process", txt);
			}
		},
		calculateTotal(bool, item) {
			//console.log("calcul", this.backFrom, this.allData.rooms);
			let self = this;

			if (this.backFrom !== '') {
				let rooms = this.allData.rooms;
					for (var room in rooms)
						if (rooms[room].floor === this.backFrom) {
							console.log("first if");
							this.BadgeValue = rooms[room].processNumber;
						}
						return;
			}

			if (bool) {
				let rooms = this.allData.rooms;
				//console.log(this.allData.rooms);
					for (var room in rooms)
						if (rooms[room].floor === item.name) {
							this.BadgeValue = rooms[room].processNumber;
						}
			} else {
				//console.log("123454321", this.allData.totalTickets.count);
				this.BadgeValue = this.allData.totalTickets.count;
			}
		},
		displayBadge(value) {
						console.log("refresh", value, this.BadgeValue)
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
		backFrom() {
			this.calculateTotal(false, this.backFrom);
		},
		BadgeValue() {
			console.log("UPDATE BADGE VALUE", this.BadgeValue);
		}
	},
	mounted() {
		let self = this;
		this.getEvent();
		//this.calculateTotal(false);
		setTimeout(function(){
			self.calculateTotal(false);
		}, 3000)
	}
};
</script>
<style scoped>
.displayCountBadge { 
	display: inline-grid;
	background-color: red;
	
  	align-items: center;
  	justify-content: center;
	border-radius: 50%;
	height: 20px;
	width: 20px;
	margin-bottom: 0px;
	padding-top: 2px;
}
.displayProcessElementTitle {
  display: flex;
  align-items: center;
  justify-content: center;
}
.overflowDisplayProcess {
	overflow: auto;
}
.processBadge {
	margin-left: 0px;
}
.displayButtonChooseProcess {
  display: flex;
  align-items: center;
  justify-content: center;
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