<template>
  <v-checkbox class="filter-select-step-checkbox"
              v-model="compuValue"
              :label="label"
              :color="color"
              :value="value"></v-checkbox>
</template>

<script>
export default {
  name: "spinal-checkbox",
  props: ["label", "color", "value"],
  data() {
    return {};
  },
  computed: {
    compuValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("onClick", value);
      }
    }
  }
};
</script>

<style scoped>
.spinal-checkbox-no-space {
  margin-top: 0px;
  padding-top: 0px;
}
</style>
