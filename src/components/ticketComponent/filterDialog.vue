<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">filter</v-btn>
      </template>
      <v-card>
        <v-card-title>Select Categories</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
    
  <v-container fluid>
    <div v-for="step in allSteps">
    <v-checkbox v-model="selected" :label="step" :value="step"></v-checkbox>
    </div>
  </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="clickOnSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { EventBus } from "../../config/event";

  export default {
    data () {
      return {
        dialogm1: '',
        dialog: false,
        allSteps: ["All"],
        selected: ["All"]
      }
    },
    props: ['steps', "selectedSteps"],
    mounted: function() {
      console.log("mounted dialog", this.steps, this.selectedSteps);
      for (var el in this.steps)
        if (this.allSteps.indexOf(this.steps[el]) == -1 && el !== undefined)
          this.allSteps.push(this.steps[el]);
   //     console.log(this.allSteps);
    },
    methods: {
      clickOnSave() {
      //  console.log("save !");
       // console.log(this.selected);
        this.triSelection();
        this.dialog = false;
      },
      triSelection() {
        if (this.selected.indexOf("All") !== -1)
          EventBus.$emit("select-steps", this.steps );
        else
          EventBus.$emit("select-steps", this.selected );
      }
    },
    watch: {
      steps() {
        console.log("update steps");
      },
      selectedSteps() {
        console.log("update selectedsteps");
      },
      allSteps() {
        console.log("update allsteps");
      }
    }
  };
</script>
