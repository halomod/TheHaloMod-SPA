<template>
  <div class="home">
    <MassDefinitionForm/>
    <GrowthForm/>
    <HaloModelForm/>
  </div>
</template>

<script>
import MassDefinitionForm from '../components/MassDefinitionForm.vue';
import GrowthForm from '../components/GrowthForm.vue';
import HaloModelForm from '../components/HaloModelForm.vue';

export default {
  name: 'Home',
  components: {
    MassDefinitionForm,
    GrowthForm,
    HaloModelForm,
  },
};
</script>
