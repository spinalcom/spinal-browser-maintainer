<template>
  <div style="height: 100%;overflow: hidden;">
    <div class="ticket-panel-container-header">
      <md-button class="ticket-panel-container-back-btn"
                 @click="$emit('onBackClick')">
        <i class="material-icons">arrow_back</i>
      </md-button>
      <div>
        <h3>{{selectedDomaine.name}}</h3>
        <h5>{{selectedObject.label}}</h5>
      </div>
    </div>
    <md-content class="ticket-panel-container-content md-scrollbar">
      <div class="hr-sect">
        <md-icon>location_on</md-icon>Localisation
      </div>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="md-raised"
                 v-on="on"
                 @click="openModalLocal = true"
                 style="width:100%; margin: 8px 0;">
            <span v-if="local === ''">Selectionnez un Local</span>
            <span class="text-ellipsis"
                  v-else>{{local}}</span>
          </v-btn>
        </template>
        <span>{{local|| 'Selectionnez un Local'}}</span>
      </v-tooltip>
      <v-tooltip v-if="local !== ''"
                 bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="md-raised"
                 v-on="on"
                 @click="openModalMaterial = true"
                 style="width:100%; margin: 8px 0;">
            <span v-if="materiel.name === ''">Selectionnez un
              Matériel - <i>optionnel</i></span>
            <span class="text-ellipsis"
                  v-else>{{materiel.name}}</span>
          </v-btn>
        </template>
        <span>{{materiel.name || 'Selectionnez un Matériel'}}</span>
      </v-tooltip>

      <!-- <md-field>
        <label for="local">Local</label>
        <md-input name="local"
                  id="local"
                  v-model="local"
                  disabled
                  required />
        <md-button class="inline-input-search"
                   @click="openModalLocal = true">
          <md-icon>location_searching</md-icon>
        </md-button>
      </md-field> -->
      <!-- <md-field v-if="local !== ''">
        <label for="Materiel">Matériel <i>optionnel</i></label>
        <md-input name="Materiel"
                  id="Materiel"
                  v-model="materiel.name"
                  disabled />
        <md-button class="inline-input-search"
                   @click="openModalMaterial = true">
          <md-icon>location_searching</md-icon>
        </md-button>
      </md-field> -->
      <div>
        <div class="hr-sect">
          <md-icon>priority_high</md-icon>Priorité
        </div>
        <v-radio-group class="priority-selector"
                       v-model="priority"
                       color="red"
                       row>
          <v-radio label="Urgent"
                   color="red"
                   :value="1"></v-radio>
          <v-radio label="Normal"
                   :value="2"></v-radio>
          <v-radio label="A l'occasion"
                   :value="3"></v-radio>
        </v-radio-group>
      </div>
      <div class="hr-sect">
        <md-icon>edit</md-icon>Précisez votre demande
      </div>

      <md-field>
        <label for="Comment">Précisez votre demande</label>
        <md-textarea class="ticket-area-comment"
                     name="Comment"
                     id="Comment"
                     v-model="comment" />
      </md-field>
      <!-- <v-textarea
                  class="ticket-area-comment"
                  name="Comment"
                  id="Comment"
                  label="Précisez votre demande ici."
                  :value="comment"></v-textarea> -->
      <div class="button-bar-footer">
        <md-button class="btn-send-di md-raised"
                   :disabled="isDisabled"
                   @click="sendClick">
          <md-icon>send</md-icon>
          Valider votre demande
        </md-button>
      </div>

    </md-content>
    <div v-if="isSending"
         class="ticket-spinner-container">
      <md-progress-spinner class="md-accent"
                           md-mode="indeterminate"></md-progress-spinner>
    </div>
    <modal-get-local :show="openModalLocal"
                     @localSelected="onLocalSelected"
                     @closeDialog="openModalLocal = false">
    </modal-get-local>
    <modal-get-material :show="openModalMaterial"
                        :local="localNode"
                        @materialSelected="onMaterialSelected"
                        @closeDialog="openModalMaterial = false">
    </modal-get-material>

  </div>
</template>

<script>
import { createRequest, requestCode } from "../../services/serviceTicket";
import modalGetLocal from "./modalGetLocal.vue";
import modalGetMaterial from "./modalGetMaterial.vue";
import { GetSpatialContext } from "./GetSpatialContext";
import throttle from "lodash.throttle";
export default {
  name: "ticket-declare-view",
  props: ["localId", "bimObjId", "selectedDomaine", "selectedObject"],
  data() {
    return {
      comment: "",
      local: "",
      materiel: { name: "" },
      priority: 2,
      openModalLocal: false,
      openModalMaterial: false,
      isSending: false,
      localNode: null
    };
  },
  components: {
    "modal-get-local": modalGetLocal,
    "modal-get-material": modalGetMaterial
  },
  computed: {
    isDisabled() {
      return this.isSending === true || this.local.length === 0;
    }
  },
  mounted() {
    this.updateLocationAndMatBinded = throttle(
      this.updateLocationAndMat.bind(this),
      100
    );
    this.updateLocationAndMatBinded();
  },
  watch: {
    localId() {
      return this.updateLocationAndMatBinded();
    },
    bimObjId() {
      return this.updateLocationAndMatBinded();
    }
  },
  methods: {
    async updateLocationAndMat() {
      if (this.localId) {
        const plocal = await GetSpatialContext.getPath(this.localId);
        this.local = plocal.map(el => el.name).join("/");
        this.localNode = plocal[plocal.length - 1];
      }
      if (spinal.spinalGraphService.getRealNode(this.localId)) {
        const mats = await GetSpatialContext.getMaterial({ id: this.localId });
        for (const m of mats) {
          if (m.id === this.bimObjId) {
            return (this.materiel = m);
          }
        }
      }
      this.materiel = { name: "" };
    },
    searchLocal() {
      console.log("searchLocal");
    },
    onLocalSelected(path) {
      console.log("onLocalSelected", path);
      this.local = path.map(el => el.name).join("/");
      this.localNode = path[path.length - 1];
      this.materiel = { name: "" };
    },
    // async sendClick() {
    async sendClick() {
      this.isSending = true;
      const req = {
        domaine: this.selectedDomaine.name,
        object: this.selectedObject.label,
        local: this.localNode.id,
        comment: this.comment,
        priority: this.priority,
        timeStart: Date.now()
      };
      req.equipment = this.materiel.id;
      await createRequest(requestCode.createDI, req);
      this.isSending = false;
      this.$emit("onSelect");
    },
    onMaterialSelected(material) {
      console.log("onMaterialSelected", material);
      this.openModalMaterial = false;
      this.materiel = material;
    }
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
.md-field .inline-input-search {
  min-height: unset;
  height: unset;
  min-width: unset;
  width: unset;
}
.ticket-spinner-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  background-color: rgba(22, 22, 22, 0.6);
  text-align: center;
  display: flex;
  justify-content: center;
}
.ticket-spinner-container .md-progress-spinner {
  align-self: center;
}

.button-bar-footer {
  text-align: right;
}
.ticket-area-comment {
  overflow-y: auto;
}
.ticket-area-comment * {
  color: white !important;
}

.ticket-area-comment::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  border-radius: 8px;
}
.ticket-area-comment::-webkit-scrollbar-button {
  display: none;
}
.ticket-area-comment::-webkit-scrollbar-corner {
  background: transparent;
}
.ticket-area-comment::-webkit-scrollbar-track {
  background: #212121;
}
.ticket-area-comment::-webkit-scrollbar-thumb {
  background: #9e9e9e;
  border-radius: 8px;
}

.hr-sect {
  display: flex;
  flex-basis: 100%;
  align-items: center;
  font-size: 15px;
  text-transform: uppercase;
  margin: 8px 0px;
  color: white;
}
.hr-sect .md-icon {
  color: white !important;
}
.hr-sect::before,
.hr-sect::after {
  content: "";
  flex-grow: 1;
  background: white;
  height: 1px;
  font-size: 0px;
  line-height: 0px;
  margin: 0px;
}
.hr-sect::after {
  margin-left: 16px;
}
.hr-sect::before {
  margin-right: 16px;
}

.ticket-panel-container-content {
  padding: 0 8px;
  position: relative;
}
.priority-selector * {
  color: white !important;
}
.btn-send-di {
  /* background-color: white !important; */
}
.btn-send-di:disabled {
  /* background-color: white !important; */
}
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

