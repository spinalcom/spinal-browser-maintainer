<template>
  <md-dialog class="dialog-select-local"
             :md-active.sync="showDialog">
    <div class="dialog-select-local-subheader">
      <md-button v-if="this.path.length > 0"
                 class="dialog-select-local-subheader-back"
                 @click="onClickBack">
        <i class="material-icons">arrow_back</i>
      </md-button>
      <div>
        <h3> Sélectionnez un local</h3>
        <h5>{{pathComputed}}</h5>
      </div>
    </div>
    <md-dialog-content md-dynamic-height>
      <md-list class="md-dense">
        <md-list-item v-for="item in selected"
                      :key="item.id"
                      @click="onSelect(item)">
          {{item.name}}
        </md-list-item>
      </md-list>
    </md-dialog-content>
  </md-dialog>

</template>

<script>
import { GetSpatialContext, ROOM_TYPE } from "./GetSpatialContext";
export default {
  name: "modal-get-local",
  props: ["show"],
  data() {
    return {
      id: 0,
      path: [],
      selected: []
    };
  },
  watch: {
    show() {
      if (this.show === true) {
        this.path = [];
        return GetSpatialContext.getStart().then(data => {
          this.selected = data;
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
    },
    pathComputed() {
      return this.path.map(e => e.name).join("/");
    }
  },
  methods: {
    createTestObj(type) {
      const id = this.id;
      this.id++;
      return {
        id,
        type,
        name: `test_${type}`
      };
    },
    onClickBack() {
      const last = this.path.pop();
      //get prev
      return GetSpatialContext.getPrev(last.id).then(data => {
        this.selected = data;
      });
    },
    onSelect(data) {
      if (data.type === ROOM_TYPE) {
        this.path.push(data);
        this.$emit("localSelected", this.path);
        this.$emit("closeDialog");
        return;
      }
      this.path.push(data);
      return GetSpatialContext.getNext(data.id).then(data => {
        this.selected = data;
      });
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
