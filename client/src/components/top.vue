<template>
  <bias-form v-model="modelData.bias"/>
</template>

<script>
import BiasForm from './BiasForm.vue';

export default {
  name: 'Top',
  data: () => ({
    modelData: {
      bias: {
        bias_model: null,
        bias_params: null,
      },
    },
  }),
  watch: {
    'modelData.bias': {
      deep: true,
      handler() {
        console.log(this.modelData.bias);
      },
    },
  },
  components: {
    BiasForm,
  },
};
</script>
