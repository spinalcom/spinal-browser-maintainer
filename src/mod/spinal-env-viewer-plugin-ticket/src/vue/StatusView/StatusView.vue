<template>
  <div style="height: 100%;overflow: hidden;">
    <div class="ticket-panel-container-header">
      <md-button class="ticket-panel-container-back-btn"
                 @click="$emit('onBackClick')"><i class="material-icons">arrow_back</i></md-button>
      <h3>Status: {{selectedDomaine.name}}</h3>
    </div>
    <md-content class="ticket-panel-container-content md-scrollbar">
      <md-list class="md-dense">
        <md-list-item v-for="stp in selectedDomaine.status"
                      :key='stp.id'
                      @click="$emit('onSelect',stp)">
          {{stp.label}}
          <div v-if="showTicket === true"
               style="text-align: center;">
            <div class="step-view"
                 :style="getStatusStyle(stp)"><span>{{stp.number}}</span></div>
          </div>
        </md-list-item>
      </md-list>
    </md-content>
  </div>
</template>

<script>
import { getContrastYIQ } from "../../utils/hexToRgb";
export default {
  name: "status-view",
  props: ["selectedDomaine", "showTicket"],
  data() {
    return {};
  },
  methods: {
    selectDomaine(domaine) {
      this.$emit("onSelect", domaine);
    },
    getStatusStyle(step) {
      return {
        "background-color": step.color,
        color: getContrastYIQ(step.color)
      };
    }
  }
};
</script>

<style scpoed>
.step-view {
  display: flex;
  min-width: 16px;
  min-width: 2.3ex;
  margin: 1px;
  padding: 1px;
  border-radius: 4px;
}

.step-view > span {
  width: 100%;
}

.ticket-panel-container .ticket-panel-container-back-btn {
  margin-left: 0;
  border-radius: 50%;
  width: 36px;
  min-width: unset;
}
.ticket-panel-container-header > .ticket-panel-container-back-btn ~ h3 {
  margin-left: unset;
}
</style>

