<template>
  <md-dialog class="dialog-select-local"
             :md-active.sync="showDialog">
    <div class="dialog-select-local-subheader">
      <md-button class="dialog-select-local-subheader-back"
                 @click="$emit(`closeDialog`)">
        <i class="material-icons">arrow_back</i>
      </md-button>
      <div>
        <h3>Sélectionnez un materiel</h3>
      </div>
    </div>
    <md-dialog-content md-dynamic-height>
      <md-list class="md-dense">
        <md-list-item v-for="item in materials"
                      :key="item.id"
                      @click="onSelect(item)">
          {{item.name}}
        </md-list-item>
      </md-list>
    </md-dialog-content>
  </md-dialog>

</template>

<script>
import { GetSpatialContext } from "./GetSpatialContext";
export default {
  name: "modal-get-material",
  props: ["show", "local"],
  data() {
    return {
      materials: []
    };
  },
  watch: {
    show() {
      if (this.show === true) {
        return GetSpatialContext.getMaterial(this.local).then(data => {
          this.materials = data;
        });
      }
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show;
      },
      set() {
        this.$emit("closeDialog");
      }
    }
  },
  methods: {
    onClickBack() {
      const last = this.path.pop();
      //get prev
      return GetSpatialContext.getMaterial(last.id).then(data => {
        this.selected = data;
      });
    },
    onSelect(data) {
      console.log("ONSELECT", data);
      this.$emit("materialSelected", data);
      // this.$emit("closeDialog");
    }
  },
  mounted() {}
};
</script>

<style>
.dialog-select-local {
  width: 60vw;
  min-height: 40vh;
}
.dialog-select-local-subheader {
  padding: 0 1em;
  background-color: #222;
  height: 48px;
  display: flex;
}
.dialog-select-local-subheader-back {
  margin-left: 0;
  border-radius: 50%;
  width: 36px;
  min-width: unset;
}
</style>
