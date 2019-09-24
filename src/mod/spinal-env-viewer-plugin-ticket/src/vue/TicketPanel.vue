
<template>
  <div class="ticket-panel-main-container">
    <transition name="ticketsteper">
      <menu-select :key=0
                   v-if="page === 0"
                   @onSelectConsult="onSelectConsult"
                   @onSelectDeclare="onSelectDeclare"></menu-select>

      <consult-ticket :key=1
                      @onSelectMenu="onSelectMenu"
                      v-if="page === 1"></consult-ticket>
      <declare-ticket :key=2
                      @onSelectMenu="onSelectMenu"
                      v-if="page === 2"></declare-ticket>
    </transition>
  </div>
</template>

<script>
import consultTicket from "./Consult.vue";
import declareTicket from "./Declare.vue";
import menuSelect from "./MenuSelect/MenuSelect.vue";
import {TICKET_PANEL_NAME, TICKET_PANEL_TITLE} from '../config';
export default {
  name: "TicketPanel",
  components: {
    "consult-ticket": consultTicket,
    "declare-ticket": declareTicket,
    "menu-select": menuSelect
  },
  data() {
    return {
      page: 0
    };
  },
  methods: {
    opened(obj) {
      console.log("opened", obj);
      this.step = 0;
    },
    closed(obj) {
      console.log("closed", obj);
    },
    removed(obj) {
      console.log("removed", obj);
    },
    renameTitlePanel(str) {
      window.spinal.spinalPanelManagerService.panels[TICKET_PANEL_NAME].panel.setTitle(str);
    },
    onSelectMenu() {
      console.log("onSelectMenu");
      this.page = 0;
      this.renameTitlePanel(TICKET_PANEL_TITLE);
    },
    onSelectConsult() {
      console.log("onSelectConsult");
      this.page = 1;
      this.renameTitlePanel(TICKET_PANEL_TITLE + " : Consulter les demandes");
    },
    onSelectDeclare() {
      console.log("onSelectDeclare");
      this.page = 2;
      this.renameTitlePanel(TICKET_PANEL_TITLE + " : Créer une demande");
    }
  },
  mounted() {}
};
</script>

<style>

.ticket-panel-main-container * {
  box-sizing: border-box;
  overflow: hidden;
}
.ticket-panel-main-container {
  height: calc(100% - 20px);
  overflow: hidden;
}

.ticket-panel-container {
  height: 100%;
  overflow: hidden;
}

.ticket-panel-container .ticket-panel-container-header {
  background-color: #222;
  height: 48px;
  display: flex;
}
.ticket-panel-container-header div {
  margin-bottom: auto;
  margin-top: auto;
}

.ticket-panel-container-header h3,
.ticket-panel-container-header h5 {
  margin-bottom: auto;
  margin-top: auto;
  margin-left: 1pc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticket-panel-container > div > .ticket-panel-container-content {
  height: calc(100% - 48px);
  width: 100%;
  overflow: auto;
  background-color: transparent;
}

.ticketsteper-enter-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.ticketsteper-enter {
  opacity: 0;
  transform: translateX(-1em);
  min-width: unset;
}

.ticketsteper-enter-to {
  opacity: 1;
  transform: translateX(0);
  min-width: unset;
}
</style>
