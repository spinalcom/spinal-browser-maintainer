<template>
  <span>
    {{stepName}}
  </span>
</template>

<script>
import dataService from "../../config/data";

export default {
  name: "stepName",
  data() {
    return { stepName: "" };
  },
  props: ["ticketId"],
  watch: {
    ticketId() {
      return this.getName();
    }
  },
  methods: {
    async getName() {
      const ticket = spinal.spinalGraphService.getRealNode(this.ticketId);
      const ptr = await dataService.getTicketStep(ticket);
      this.stepName = ptr.info.name.get();
    }
  },
  mounted() {
    return this.getName();
  }
};
</script>
