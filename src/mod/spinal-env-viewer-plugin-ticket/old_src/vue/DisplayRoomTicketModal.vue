<template>
    <md-dialog :md-active.sync="openModal">
        <div class="display-room-ticket-modal-body">
            <div class="display-room-ticket-modal-room">
                <h1> {{this.roomName}} </h1>
                <div class="display-room-ticket-modal-ticket"
                     v-for="(ticket) in tickets"
                >
                    <div class="display-room-ticket-modal-ticket-name">
                        {{ticket.name.get()}}
                    </div>
                    <spinal-icon-button
                            class="display-room-ticket-modal-ticket-modify"
                            @click="openModifyPanel(ticket)"
                            icon="assignment_ind"
                            tool-tip="modifier ticket"/>
                </div>
                <md-dialog-actions>
                    <md-button class="md-primary" v-on:click="closeModal">Fermer
                    </md-button>
                </md-dialog-actions>
            </div>
            <div class="modify-ticket-modal-body" v-if="displayTicket">
                <div class="modify-ticket-modal-body-header">
                    <h1> Ticket </h1>
                    <spinal-icon-button
                            class="display-room-ticket-modal-ticket-modify"
                            @click="closeModifyPanel"
                            icon="close"
                            tool-tip="modifier ticket"/>

                </div>
                <md-field>
                    <label>Titre de l'incident</label>
                    <md-input v-model="selectedTicket.name"></md-input>
                </md-field>

                <md-field>
                    <label>Note</label>
                    <md-input v-model="selectedTicket.note"></md-input>
                </md-field>
                <md-field>
                    <label for="currentStep">Etape</label>
                    <md-select id="currentStep" name="currentStep"
                               v-model="selectedTicket.currentStep">
                        <md-option :value="step.id" v-for="step in
                        selectedTicket.steps">
                            {{step.name}}
                        </md-option>
                    </md-select>
                </md-field>
                <md-dialog-actions>
                    <md-button class="md-primary" v-on:click="modifyTicket">
                        Modifier
                    </md-button>
                </md-dialog-actions>

            </div>
        </div>
    </md-dialog>
</template>

<script>
  import { SpinalIconButton } from "spinal-env-viewer-vue-components-lib";
  import { SpinalServiceTicket } from 'spinal-service-ticket';

  export default {
    name: "DisplayRoomTicketModal",
    components: { SpinalIconButton },
    data: function () {
      return {
        tickets: [],
        openModal: false,
        roomName: '',
        selectedTicket: {
          defaultName: '',
          defaultStep: '',
          id: '',
          name: '',
          note: '',
          currentStep: '',
          steps: []
        },
        displayTicket: false
      }

    },
    props: {
      onFinised: {
        type: Function,
      }
    },
    methods: {
      opened: function ( option ) {
        for (let i = 0; i < option.tickets.length; i++) {
          this.tickets.push( option.tickets[i] )
        }
        this.roomName = option.roomName;
        this.tickets.push( ...option );
        this.openModal = true;
      },
      removed: function () {
        this.tickets = [];
      },
      closeModal: function ( closeResult ) {
        this.onFinised( { closeResult } );
        this.openModal = false;
      },
      modifyTicket: function (){
        if (this.selectedTicket.defaultStep !== this.selectedTicket.currentStep) {
          SpinalServiceTicket.moveTicket(
            this.selectedTicket.id,
            this.selectedTicket.defaultStep,
            this.selectedTicket.currentStep
          );
        }
        if (this.selectedTicket.defaultName !== this.selectedTicket.name) {
          SpinalGraphService
            .modifyNode(
              this.selectedTicket.id, {
                name: this.selectedTicket.name,
                note: this.selectedTicket.note
              }
            )
        }
      },
      openModifyPanel: function ( event ) {
        this.selectedTicket.name = event.name.get();
        this.selectedTicket.note = event.note.get();
        this.selectedTicket.id = event.id.get();
        this.selectedTicket.defaultStep = event.stepId.get();
        this.selectedTicket.defaultName = event.name.get(),
        SpinalServiceTicket.getStepsFromProcessAsync( event.processId.get() )
          .then(
            steps => {
              this.selectedTicket.steps = [];
              for (let i = 0; i < steps.length; i++) {
                const step = {};
                step['name'] = steps[i].name.get();
                step['id'] = steps[i].id.get();

                if (step['id'] === event.stepId.get())
                  this.selectedTicket.currentStep = step['name'];
                this.selectedTicket.steps.push( step );
              }
              this.displayTicket = true;
            }
          );
      },
      closeModifyPanel: function (  ) {
        this.displayTicket = false;
      }
    },
    watch: {
      openModal: {
        handler: function ( value ) {
          if (!value)
            this.onFinised();
        },
      },

    }
  }
</script>

<style scoped>

    .display-room-ticket-modal-body {
        display: flex;
    }

    .display-room-ticket-modal-room {
        margin: 8px;
    }

    .display-room-ticket-modal-ticket {
        border: solid 1px;
        margin: 8px;
        position: relative;
        height: 44px;
    }

    .display-room-ticket-modal-ticket-modify {
        position: absolute;
        right: 8px
    }

    .display-room-ticket-modal-ticket-name {
        position: absolute;
        left: 8px;
        font-size: 16px;
        margin: 8px;
    }
    .modify-ticket-modal-body {
        padding: 16px;
    }

    .modify-ticket-modal-body-header {
        display: flex;
    }
</style>