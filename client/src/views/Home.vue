<template>
  <div class="home">
    <CosmologyForm/>
    <TracerProfileForm/>
  </div>
</template>

<script>
import CosmologyForm from '../components/CosmologyForm.vue';
import TracerProfileForm from '../components/TracerProfileForm.vue';

export default {
  name: 'Home',
  components: {
    CosmologyForm,
    TracerProfileForm,
  },
};
</script>
