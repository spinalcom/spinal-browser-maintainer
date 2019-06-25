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

		}
	},
	props: ["processList"],
	methods: {
		selectProcess(target) {
			EventBus.$emit("select-process", target.target.innerText);
		}
	}
};
</script>
<style scoped>
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
}
</style>