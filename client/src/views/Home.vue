<template>
  <div class="home">
    <CosmologyForm/>
  </div>
</template>

<script>
import CosmologyForm from '../components/CosmologyForm.vue';

export default {
  name: 'Home',
  data: () => ({
    hmfConstants: null,
  }),
  components: {
    CosmologyForm,
  },
  created() {
    // CHANGE TO ENV VARIABLE FOR HOST LOCATION
    fetch('http://localhost:5000/constants').then((data) => data.json()).then((json) => {
      console.log(json);
    });
  },
};
</script>
