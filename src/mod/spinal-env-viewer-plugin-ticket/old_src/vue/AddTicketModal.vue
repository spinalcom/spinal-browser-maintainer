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
    <md-dialog :md-active="displayAddTicket">

        <div class="add-ticket-modal-body">
            <md-field>
                <md-select name="Process" v-model="selectedProcess">
                    <md-option :key="index"
                               :value="process.id.get()"
                               v-for="(process, index) in processesComputed">
                        {{process.name.get()}}
                    </md-option>
                </md-select>
            </md-field>
            <md-field>
                <md-select name="incidents commun" v-model="selectedCategory">
                    <md-option :key="index"
                               :value="incident.id"
                               v-for="(incident, index) in incidents">
                        {{incident.name}}
                    </md-option>
                </md-select>
            </md-field>


            <md-field>
                <label>note</label>
                <md-input aria-placeholder="note..." v-model="note"/>
            </md-field>
        </div>
        <md-dialog-actions>
            <md-button class="md-primary" v-on:click="onCancel">Annuler
            </md-button>
            <md-button class="md-primary" v-on:click="onConfirm">Valider
            </md-button>
        </md-dialog-actions>
    </md-dialog>

</template>

<script>
  import { SpinalServiceTicket } from 'spinal-service-ticket'
  import { SpinalGraphService } from 'spinal-env-viewer-graph-service'
  import { mapState } from 'vuex';
  import {
    SpinalList,
    SpinalListItem
  } from "spinal-env-viewer-vue-components-lib";

  function spread() {
    const res = {};
    for (const arg of arguments) {
      Object.assign( res, arg );
    }
    return res;
  }

  export default {
    name: "AddTicket",
    components: { SpinalList, SpinalListItem },
    data: function () {
      return {
        ticketName: "",
        selectedCategory: { value: '' },
        selectedProcess: '',
        note: '',
        incidents: []
      }
    },

    computed: spread(
      mapState( [
        'displayAddTicket',
        'selectedNode',
        'processes',
        'categoryByProcess'
      ] ),
      {
        processesComputed: function () {
          if (typeof this.processes !== "undefined") {
            const processes = [];
            for (let i = 0; i < this.processes.length; i++) {
              processes.push( SpinalGraphService.getNode( this.processes[i] ) );
            }
            return processes;
          }
          return [];
        },
      }
    ),

    methods: {
      getProcess: function () {
        if (typeof this.processes !== "undefined") {
          const processes = [];
          for (let i = 0; i < this.processes.length; i++) {
            processes.push( SpinalGraphService.getNode( this.processes[i] ) );
          }
          return processes;
        }
        return [];
      },
      getCategories: function () {
        if (typeof this.categoryByProcess !== "undefined"
          && this.selectedProcess.length !== 0
          && this.categoryByProcess.has( this.selectedProcess )
        ) {
          return this.categoryByProcess.get( this.selectedProcess );
        }
        return [];
      },
      onConfirm: function () {
        const selectedIncident = this.incidents.filter( incident =>
          incident.id === this.selectedCategory );
        const ticket = {
          name: selectedIncident[0].name,
          note: this.note,
          categories: selectedIncident[0].id,
          processId: this.selectedProcess,
          bimId: this.selectedNode.id.get(),
          username: window.spinal.spinalSystem.getUser().username,
          creationDate: Date.now()
        };

        const ticketId = SpinalServiceTicket.createTicket( ticket );

        SpinalServiceTicket.addLocationToTicket(
          this.selectedNode.id.get(),
          ticketId
        );

        SpinalServiceTicket.addTicketToProcess( ticketId,
          this.selectedProcess )
          .then( () => {
            this.$store.commit( 'TOGGLE_ADD_TICKET' );
          } )
          .catch( ( e ) => {
            console.error( e )
          } )
        ;
      },
      onCancel: function () {
        this.$store.commit( 'TOGGLE_ADD_TICKET' )
      }
    },
    watch: {
      'selectedProcess': {
        handler: function ( value ) {
          this.$store.getters.getCategories( value ).then( incidents => {
            this.incidents = [];
            for (let i = 0; i < incidents.length; i++) {
              this.incidents.push( incidents[i][0] );
            }
            this.incidents.push( { name: 'autre', id: 'autre' } );
          } );
        }
      },
      'selectedCategory': {
        handler: function ( value ) {
          console.log( value )
        },
        immediate: true
      }
    },
    mounted() {
      this.$store.dispatch( 'getProcess' );
    }
  }
</script>

<style scoped>
    .add-ticket-modal-body {
        padding: 8px;
    }
</style>