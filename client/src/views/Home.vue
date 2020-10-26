<template>
  <div class="home">
    <MassDefinitionForm/>
    <GrowthForm/>
  </div>
</template>

<script>
import MassDefinitionForm from '../components/MassDefinitionForm.vue';
import GrowthForm from '../components/GrowthForm.vue';

export default {
  name: 'Home',
  components: {
    MassDefinitionForm,
    GrowthForm,
  },
};
</script>
