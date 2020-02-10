<template>
  <v-dialog v-model="dialog"
            scrollable
            max-width="100vw"
            class="filter-step-dialog">

    <template v-slot:activator="{ on }">
      <v-btn text
             icon
             v-on="on"
             style="margin-left: 0;margin-right: 0;">
        <v-icon>filter_list</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Select Categories</v-card-title>

      <v-divider></v-divider>

      <v-card-text style="height: 300px;">
        <v-container fluid>
          <v-checkbox class="spinal-checkbox-no-space"
                      v-model="all"
                      label=""
                      :value="false"
                      :indeterminate="isIntermediate">
            <template v-slot:label>
              <div class="spinal-checkbox-filter-step-label"
                   :style="getStyleByColor('#9e9e9e')"></div>
              <span>Tous les états</span>
            </template>
          </v-checkbox>
          <!-- :label="step.name" -->

          <v-checkbox class="spinal-checkbox-no-space"
                      v-for="step in steps"
                      v-model="selected"
                      color="blue"
                      :key="step.name"
                      :value="step">
            <template v-slot:label>
              <div class="spinal-checkbox-filter-step-label"
                   :style="getStyleByColor(step.color)"></div>
              <span>{{step.name}}</span>
            </template>

          </v-checkbox>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="filter-step-dialog-footer-btn-container">
        <v-btn color="blue darken-1"
               flat
               @click="clickOnCancel">Close</v-btn>
        <v-btn color="blue darken-1"
               flat
               @click="clickOnSave">Save</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
import { EventBus } from "../../config/event";
import spinalCheckbox from "./spinal-checkbox.vue";
import { getStyleByColor } from "../../config/getStyleByColor";
export default {
  data() {
    return {
      dialog: false,
      selected: []
    };
  },
  props: ["steps", "selectedSteps"],
  mounted() {
    this.reset();
  },
  computed: {
    isIntermediate() {
      return !this.all && this.selected.length !== 0;
    },
    all: {
      get() {
        return this.selected && this.selected.length === this.steps.length;
      },
      set(value) {
        if (value) {
          this.selected = this.steps;
        } else {
          this.selected = [];
        }
      }
    }
  },
  methods: {
    reset() {
      this.selected = this.selectedSteps;
    },
    clickOnCancel() {
      this.dialog = false;
    },
    clickOnSave() {
      EventBus.$emit("select-steps", this.selected);
      this.dialog = false;
    },
    open() {
      this.dialog = true;
    },
    getStyleByColor
  },
  watch: {
    dialog(value) {
      if (value) {
        this.reset();
      }
    }
  }
};
</script>

<style scoped>
.spinal-checkbox-no-space {
  margin-top: 5px !important;
  padding-top: 0px !important;
}
.filter-step-dialog-footer-btn-container {
  display: flex;
  justify-content: flex-end;
}
.spinal-checkbox-filter-step-label {
  width: 0.5rem;
  height: 1.3rem;
  margin-right: 3px;
}
</style>

<style>
.v-dialog.v-dialog--active {
  width: auto;
}
.spinal-checkbox-no-space .v-input__control .v-input__slot {
  margin-bottom: 0;
}
.spinal-checkbox-no-space .v-input__control .v-messages {
  display: none;
}
</style>
