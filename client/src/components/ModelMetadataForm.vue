<template>
  <form novalidate>
    <md-field>
      <label> Model Name </label>
      <md-input v-model="input"/>
    </md-field>
  </form>
</template>

<script>
export default {
  name: 'ModelMetadataForm',
  props: {
    modelName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      input: this.modelName,
    };
  },
  watch: {
    input() {
      this.$emit('onChange', this.input);
    },
  },
};
</script>
