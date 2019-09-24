
<template>
  <div class="ticket-panel-container">
    <transition name="declare-ticket">
      <domaine-view :key=0
                    @onBackClick="$emit('onSelectMenu')"
                    v-if="step === 0"
                    :showTicket="showTickets"
                    :domaines="domaines"
                    @onSelect="onSelectDomaine"></domaine-view>
      <object-view :key=1
                   v-else-if="step === 1"
                   @onBackClick="onClickBack"
                   :selectedDomaine="selectedDomaine"
                   @onSelect="onSelectObject"></object-view>
      <ticket-declare-view :key=2
                           v-else-if="step === 2"
                           :selectedDomaine="selectedDomaine"
                           :selectedObject="selectedObject"
                           @onBackClick="onClickBack"
                           @onSelect="$emit('onSelectMenu')"></ticket-declare-view>
    </transition>
  </div>
</template>

<script>
import domaineView from "./DomaineView/DomaineView.vue";
import objectView from "./ObjectsView/ObjectView.vue";
import ticketDeclareView from "./TicketDeclareView/TicketDeclareView.vue";
import { getDomaines } from "../services/serviceTicket";

export default {
  name: "declare-ticket",
  components: {
    "domaine-view": domaineView,
    "object-view": objectView,
    "ticket-declare-view": ticketDeclareView
  },
  data() {
    return {
      step: 0,
      domaines: [],
      showTickets: false,
      selectedDomaine: null,
      selectedObject: null,
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
    onSelectObject(selectedObject) {
      this.selectedObject = selectedObject;
      this.step = 2;
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
.declare-ticket-enter-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.declare-ticket-enter {
  opacity: 0;
  transform: translateX(-1em);
  min-width: unset;
}

.declare-ticket-enter-to {
  opacity: 1;
  transform: translateX(0);
  min-width: unset;
}
</style>
