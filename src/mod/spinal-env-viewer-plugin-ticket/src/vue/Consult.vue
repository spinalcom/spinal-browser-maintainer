
<template>
  <div class="ticket-panel-container">
    <transition name="consult-ticket">
      <domaine-view :key=0
                    @onBackClick="$emit('onSelectMenu')"
                    v-if="step === 0"
                    :domaines="domaines"
                    :showTicket="showTickets"
                    @onSelect="onSelectDomaine"></domaine-view>
      <status-view :key=1
                   v-else-if="step === 1"
                   :showTicket="showTickets"
                   @onBackClick="onClickBack"
                   :selectedDomaine="selectedDomaine"
                   @onSelect="onSelectStatus"></status-view>

      <ticket-view :key=2
                   v-else-if="step === 2"
                   @onBackClick="onClickBack"
                   :selectedDomaine="selectedDomaine"
                   :selectedStatus="selectedStatus"
                   @onSelect="onSelectTicket"></ticket-view>
    </transition>
  </div>
</template>

<script>
import domaineView from "./DomaineView/DomaineView.vue";
import statusView from "./StatusView/StatusView.vue";
import { getDomaines } from "../services/serviceTicket";
import ticketView from "./TicketsView/TicketsView.vue";

export default {
  name: "consult-ticket",
  components: {
    "domaine-view": domaineView,
    "status-view": statusView,
    "ticket-view": ticketView
  },
  data() {
    return {
      step: 0,
      domaines: [],
      showTickets: true,
      selectedDomaine: null,
      selectedStatus: null,
      selectedTicket: null
    };
  },
  methods: {
    onClickBack() {
      if (this.step > 0) {
        --this.step;
      }
    },
    onSelectDomaine(selectedDomaine) {
      this.selectedDomaine = selectedDomaine;
      this.step = 1;
    },
    onSelectStatus(selectedStatus) {
      this.selectedStatus = selectedStatus;
      this.step = 2;
    },
    onSelectTicket(selectedTicket) {
      this.selectedTicket = selectedTicket;
      // this.step = 3;
    }
  },
  mounted() {
    this.domaineBind = getDomaines(domaines => {
      this.domaines = domaines;
    });
  },
  beforeDestroy() {
    if (this.domaineBind) {
      const tmp = this.domaineBind;
      this.domaineBind = null;
      tmp();
    }
  }
};
</script>

<style>
.consult-ticket-enter-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.consult-ticket-enter {
  opacity: 0;
  transform: translateX(-1em);
  min-width: unset;
}

.consult-ticket-enter-to {
  opacity: 1;
  transform: translateX(0);
  min-width: unset;
}
</style>
