<template>
	<div>
		<sidebar-menu :menu="menu" />
	</div>
</template>

<script>
import Vue from 'vue';
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
//import spinalGraphService from "spinal-env-viewer-graph-service"

export default Vue.extend({
	data() {
		return {
                menu: [
                    {
                        header: true,
                        title: 'Spinalcom Maintainer',
                         //component: componentName
                         //visibleOnCollapse: true
                    }
                ]
		}
	},
	components: {
		VueSidebarMenu
	},
	created() {
		this.menu.push({ title: 'etage1', child: [ {title: 'room1'}, {title: 'room2'} ]});
		console.log(this.menu);
	},
	methods: {
		onCollapse(collapsed) {
			console.log("collapsed");
		},
		onItemClick(event, item) {
			console.log("click on item", item);
		}
	}
});
</script>