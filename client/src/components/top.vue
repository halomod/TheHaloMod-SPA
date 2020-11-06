<template>
  <bias-form @onChange="modelData.bias = $event"/>
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
  components: {
    BiasForm,
  },
};
</script>
