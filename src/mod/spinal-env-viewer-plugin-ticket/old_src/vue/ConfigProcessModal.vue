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
    <md-dialog :md-active="displayConfigProcess">
        <md-field>
            <label>Process name</label>
            <md-input v-model="processName"></md-input>
        </md-field>

        <div v-if="!modifyDefaultStep">
            <label> Default step</label>
            {{defaultStepName}}
            <spinal-icon-button
                    @click=" modifyDefaultStep = !modifyDefaultStep"
                    icon="edit">

            </spinal-icon-button>
        </div>
        <div v-else>
            <label for="steps">Steps</label>
            <select id="steps" name="steps" v-model="selectedStep">
                <option :value="step.id" v-for="step in getStep()">
                    {{step.name}}
                </option>
            </select>
        </div>

        <md-dialog-actions>
            <md-button class="md-primary" v-on:click="onCancel">
                Cancel
            </md-button>
            <md-button class="md-primary" v-on:click="onConfirm">
                Modify
            </md-button>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>
  import { SpinalGraphService } from 'spinal-env-viewer-graph-service'
  import { SpinalServiceTicket } from 'spinal-service-ticket'
  import { mapState } from 'vuex';
  import { SpinalIconButton } from "spinal-env-viewer-vue-components-lib"

  export default {
    name: "ConfigProcessModal",
    components: { SpinalIconButton },
    data: function () {
      return {
        processName: "",
        defaultStepName: "",
        modifyDefaultStep: false
      }
    },

    computed: mapState( ['displayConfigProcess', 'selectedNode'] ),

    methods: {
      onConfirm: function () {
        this.$store.commit( 'TOGGLE_CONFIG_PROCESS' )

      },

      onCancel: function () {
        this.$store.commit( 'TOGGLE_CONFIG_PROCESS' )
      },

      getStep: function () {
        if (
          (typeof this.selectedNode !== "undefined")
          && this.selectedNode.hasOwnProperty( 'processId' )
        ) {

          const processId = this.selectedNode.id.get();
          const stepIds = SpinalServiceTicket
            .getStepsFromProcess( processId );

          return stepIds.map( ( stepId ) => {
            const node = SpinalGraphService.getNode( stepId );
            return { id: node.id.get(), name: node.name.get() }
          } );
        }
        return [];
      }
    },
    watch: {
      'selectedNode.name': {
        handler: function ( value ) {
          if (typeof value !== "undefined") {
            this.processName = value.get();
            console.log( value )
          }
        },
        immediate: true
      },
      'selectedNode.defaultStepId': {
        handler: function ( value ) {
          if (typeof value !== "undefined") {
            const node = SpinalGraphService.getNode( value.get() );
            if (node.hasOwnProperty( 'name' ))
              this.defaultStepName = node.name.get();
          }
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>

</style>