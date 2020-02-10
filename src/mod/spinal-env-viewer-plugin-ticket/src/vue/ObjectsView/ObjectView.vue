<template>
  <div style="height: 100%;overflow: hidden;">
    <div class="ticket-panel-container-header">
      <md-button class="ticket-panel-container-back-btn"
                 @click="$emit('onBackClick')"><i class="material-icons">arrow_back</i></md-button>
      <div>
        <h3>{{selectedDomaine.name}}</h3>
        <h5>Sélectionnez un objet</h5>
      </div>
    </div>
    <md-content class="ticket-panel-container-content md-scrollbar">
      <md-list class="md-dense">
        <md-list-item v-for="stp in selectedDomaine.objects"
                      :key='stp.id'
                      @click="$emit('onSelect',stp)">
          {{stp.label}}
        </md-list-item>
      </md-list>
    </md-content>
  </div>
</template>

<script>
export default {
  name: "objects-view",
  props: ["selectedDomaine"],
  data() {
    return {};
  }
};
</script>

<style scpoed>
.ticket-panel-container .ticket-panel-container-back-btn {
  margin-left: 0;
  border-radius: 50%;
  width: 36px;
  min-width: unset;
}
</style>

