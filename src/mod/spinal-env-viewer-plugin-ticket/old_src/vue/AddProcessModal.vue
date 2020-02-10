<!--
  - Copyright 2019 SpinalCom - www.spinalcom.com
  -
  -  This file is part of SpinalCore.
  -
  -  Please read all of the following terms and conditions
  -  of the Free Software license Agreement ("Agreement")
  -  carefully.
  -
  -  This Agreement is a legally binding contract between
  -  the Licensee (as defined below) and SpinalCom that
  -  sets forth the terms and conditions that govern your
  -  use of the Program. By installing and/or using the
  -  Program, you agree to abide by all the terms and
  -  conditions stated or referenced herein.
  -
  -  If you do not agree to abide by these terms and
  -  conditions, do not demonstrate your acceptance and do
  -  not install or use the Program.
  -  You should have received a copy of the license along
  -  with this file. If not, see
  -  <http://resources.spinalcom.com/licenses.pdf>.
  -->

<template>
    <md-dialog
            :md-active="displayAddProcess"
    >
        <div class="add-typology-modal-body">
            <md-field>
                <label>Nom de typologie</label>
                <md-input v-model="processName"></md-input>
            </md-field>
            <icon-selector
                    :icons="icons"
                    @icon-selected="onIconSelected"
                    title="Icons"/>
        </div>
        <md-dialog-actions>
            <md-button class="md-primary" v-on:click="onCancel">
                Annuler
            </md-button>
            <md-button class="md-primary" v-on:click="onConfirm">
                Valider
            </md-button>
        </md-dialog-actions>

    </md-dialog>
</template>

<script>
  import { SpinalServiceTicket } from 'spinal-service-ticket'
  import { mapState } from 'vuex';
  import { IconSelector } from "spinal-env-viewer-vue-components-lib";

  export default {
    name: "AddProcessModal",
    components: { IconSelector },
    data: function () {
      return {
        processName: "",
        icons: [
          'poll',
          'accessibility_new',
          'streetview',
          'build',
          'warning',
          'accessible',
          'account_balance',
          'alarm',
          'all_out',
          'announcement',
          'bug_report',
          'bookmark',
          'book',
          'dashboard',
          'favorite',
          'help',
          'group_work',
          'block',
          'ac_unit',
          'spa',
          'kitchen',
        ],
        selectedIcon: "",
      }
    },

    computed: mapState( ['displayAddProcess'] ),

    methods: {
      onConfirm: function () {
        const icon = this.selectedIcon === '' ? 'poll' : this.selectedIcon;
        SpinalServiceTicket.createProcess( {
            icon,
            name: this.processName,
          } )
          .then( () => {
            this.$store.commit( 'TOGGLE_ADD_PROCESS' );
          } )
          .catch( ( e ) => {
            console.error( e )
          } );
      },

      onCancel: function () {
        this.$store.commit( 'TOGGLE_ADD_PROCESS' )
      },

      onIconSelected: function ( event ) {
        this.selectedIcon = event;
      }
    },

  }
</script>

<style scoped>
.add-typology-modal-body{
    padding: 24px
}
</style>