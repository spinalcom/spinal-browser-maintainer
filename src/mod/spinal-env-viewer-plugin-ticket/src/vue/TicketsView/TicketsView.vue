<template>
  <div style="height: 100%;overflow: hidden;">
    <div class="ticket-panel-container-header">
      <md-button class="ticket-panel-container-back-btn"
                 @click="$emit('onBackClick')">
        <i class="material-icons">arrow_back</i>
      </md-button>
      <div class="ticket-panel-status-color"
           :style="{'background-color':selectedStatus.color}"></div>
      <div>
        <h3>Tickets: {{selectedDomaine.name}}</h3>
        <h5>{{selectedStatus.label}}</h5>
      </div>

    </div>
    <md-content class="ticket-panel-container-content md-scrollbar">
      <table class="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Objet</th>
            <th>Etage</th>
            <th>Local</th>
            <th>Début</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr class="ticket-table-row"
              v-for="ticket in tickets"
              :key='ticket.id'
              @click="onSelectTicket(ticket)">
            <td>{{ticket.GMAOTicketId}}</td>
            <td>{{ticket.name}}</td>
            <td>{{ticket.local.floor}}</td>
            <td>{{ticket.local.name}}</td>
            <td>{{getTime(ticket.creationDate)}}</td>
            <td>
              <pre>{{ticket.note}}</pre>
            </td>
            <!-- <td @click="$emit('onSelect',ticket)">{{ticket.name}}</td>
            <td @click="$emit('onSelect',ticket)">{{ticket.name}}</td>
            <td @click="$emit('onSelect',ticket)">{{getTime(ticket.start)}}</td>
            <td @click="$emit('onSelect',ticket)">{{getTime(ticket.end)}}</td> -->
          </tr>
        </tbody>
      </table>

      <!-- <md-table v-model="tickets"
                md-card
                @md-selected="onSelectTicket"> -->
      <!-- <md-table-row>
          <md-table-head>Objet</md-table-head>
          <md-table-head>Debut</md-table-head>
          <md-table-head>Fin</md-table-head>
        </md-table-row> -->

      <!-- <md-table-row slot="md-table-row"
                      slot-scope="{ item }"
                      md-selectable="single">
          <md-table-cell md-label="ID"
                         md-numeric>{{ item.id }}</md-table-cell>
          <md-table-cell md-label="Objet">{{ item.name }}</md-table-cell>
          <md-table-cell md-label="Debut">{{ getTime(item.start) }}</md-table-cell>
          <md-table-cell md-label="Fin">{{ getTime(item.end) }}</md-table-cell>
        </md-table-row> -->

      <!-- <md-table-row v-for="ticket in tickets"
                      :key='ticket.id'
                      @click="$emit('onSelect',ticket)">
          <md-table-cell @click="$emit('onSelect',ticket)">{{ticket.name}}</md-table-cell>
          <md-table-cell @click="$emit('onSelect',ticket)">{{getTime(ticket.start)}}</md-table-cell>
          <md-table-cell @click="$emit('onSelect',ticket)">{{getTime(ticket.end)}}</md-table-cell>
        </md-table-row> -->

      <!-- </md-table> -->

      <!-- <md-list class="md-dense">
        <md-list-item v-for="ticket in tickets"
                      :key='ticket.id'
                      @click="$emit('onSelect',ticket)">

          <div class="md-list-item-text">
            <h6>{{ticket.name}}</h6>
            <span>start :{{getTime(ticket.start)}}</span>
            <span>end : {{getTime(ticket.end)}}</span>
          </div>
        </md-list-item>
      </md-list> -->
    </md-content>
  </div>
</template>

<script>
import { getContrastYIQ } from "../../utils/hexToRgb";
// import moment from "moment";
import {
  selectTicketLocal,
  getTicketByDomaineAndStep
} from "../../services/serviceTicket";
export default {
  name: "ticket-view",
  props: ["selectedDomaine", "selectedStatus"],
  data() {
    return {
      tickets: []
    };
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
    },
    getTime(date) {
      return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    },
    onSelectTicket(obj) {
      selectTicketLocal(obj);
    },
    onChange(obj) {
      this.tickets = obj;
    }
  },
  mounted() {
    console.log("this.selectedStatus", this.selectedStatus);

    getTicketByDomaineAndStep(
      this.selectedDomaine,
      this.selectedStatus,
      this.onChange
    );
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
.ticket-table {
  text-align: left;
  width: calc(100% - 16px);
  margin: 8px;
  position: sticky;
}

.ticket-table thead {
  background-color: rgb(44, 44, 44);
  position: sticky;
  line-height: 1.7em;
  top: 0;
}

.ticket-table-row:hover {
  background-color: rgba(255, 255, 255, 0.12);
  cursor: pointer;
}
.ticket-table-row td {
  padding: 2px 8px;
  min-height: 36px;
}
.ticket-table-row td:first-child {
  text-align: center;
}
.ticket-table thead tr th:first-child {
  text-align: center;
}
.ticket-panel-status-color {
  height: 60%;
  width: 10px;
}
</style>

