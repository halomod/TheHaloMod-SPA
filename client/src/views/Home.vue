<template>
  <div class="home">
    You're home!
  </div>
</template>

<script>

export default {
  name: 'Home',
  // TODO: Make the data at the app level and learn how to pass this to routes
  data: () => ({}),
  async created() {
    try {
      // console.log(await this.$store.getKeys());
    } catch (e) {
      console.log(e);
    }
  },
};

</script>
