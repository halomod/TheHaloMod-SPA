<template>
  <form novalidate>
    <md-field>
      <label> Model Name </label>
      <md-input v-model="model_metadata.model_name"/>
    </md-field>
  </form>
</template>

<script>
export default {
  name: 'ModelMetadataForm',
  title: 'Model Metadata',
  id: 'model-metadata',
  model: {
    prop: 'parent_model',
    event: 'onChange',
  },
  data() {
    return {
      model_metadata: {
        model_name: 'Model',
      },
    };
  },
  updated() {
    this.$emit('onChange', this.model_metadata);
  },
};
</script>
