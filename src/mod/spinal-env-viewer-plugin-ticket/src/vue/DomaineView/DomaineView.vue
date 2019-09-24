<template>
  <div style="height: 100%;">
    <div class="ticket-panel-container-header">
      <md-button class="ticket-panel-container-back-btn"
                 @click="$emit('onBackClick')">
        <i class="material-icons">arrow_back</i>
      </md-button>
      <h3>Sélectionnez un Domaines</h3>
    </div>
    <md-content class="ticket-panel-container-content md-scrollbar">
      <md-list class="md-dense">
        <md-list-item v-for="d in domaines"
                      :key='d.id'
                      @click="selectDomaine(d)">
          {{d.name}}
          <div v-if="showTicket === true" class="step-view">
            <div v-for="stp in d.status"
                 :key="stp.id"
                 :style="getStatusStyle(stp)"
                 v-tooltip="stp.label">{{stp.number}}</div>
          </div>
        </md-list-item>
      </md-list>

    </md-content>
  </div>
</template>

<script>
import { getContrastYIQ } from "../../utils/hexToRgb";
export default {
  name: "domaine-view",
  props: ["domaines", "showTicket"],
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
  text-align: center;
}

.step-view > div {
  min-width: 16px;
  min-width: 2.3ex;
  margin: 1px;
  padding: 1px;
  border-radius: 4px;
}
.ticket-panel-container-content > .md-list {
  background-color: transparent;
}
</style>

